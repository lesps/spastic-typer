import { useMemo } from 'react';
import { G, FC, POS, alpha } from '../styles/theme.js';
import { POSITIONS } from '../data/shadow.js';
import { CLASSIFICATION, EDGES } from '../data/stack.js';
import { stackLayout, captureState, captureLevelOf, positionLabel, fillTemplate } from '../utils/stack.js';
import { LABEL_TEMPLATES } from '../data/stack.js';

const MONO = "'DM Mono',monospace";
const SANS = "'DM Sans',sans-serif";

const activate = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
};

/**
 * Inline-SVG diagram of the eight positions and their couplings.
 * Props:
 *   stack        — output of getFullStack(type) or null (positions only)
 *   level        — current Riso-Hudson level 1–9
 *   selected     — { kind: 'node', id: pos } | { kind: 'edge', id } | null
 *   onSelect     — (selection) => void
 *   fixationType — Enneagram core type to badge onto Hunger, or null
 */
export default function StackDiagram({ stack = null, level = 1, selected = null, onSelect = () => {}, fixationType = null }) {
  const layout = useMemo(() => stackLayout(), []);
  const state = captureState(level);
  const capturedSet = new Set(state.captured);
  const activeSet = new Set(state.activeEdges);
  const fnAt = (pos) => stack?.[pos - 1]?.fn ?? null;
  const colorOf = (pos) => { const fn = fnAt(pos); return fn && FC[fn] ? FC[fn] : POS[pos]; };
  const nameOf = (pos) => POSITIONS[pos - 1].name;

  return (
    <svg
      viewBox={layout.viewBox.join(' ')}
      width="100%"
      role="group"
      aria-label="Eight-position stack diagram"
      style={{ display: 'block', maxWidth: 440, margin: '0 auto', fontFamily: SANS, overflow: 'visible' }}
    >
      <defs>
        {['dim', 'spine', 'active'].map(kind => (
          <marker key={kind} id={`stack-arrow-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={kind === 'dim' ? G.textFaint : G.gold} />
          </marker>
        ))}
      </defs>

      <text x={layout.nodes[1].cx} y={16} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={G.textFaint} letterSpacing="1.5">EGO ARC</text>
      <text x={layout.nodes[5].cx} y={16} textAnchor="middle" fontSize="9" fontFamily={MONO} fill={G.textFaint} letterSpacing="1.5">SHADOW ARC</text>

      {layout.edges.map(e => {
        const spec = EDGES.find(s => s.id === e.id);
        const active = activeSet.has(e.id);
        const isSel = selected?.kind === 'edge' && selected.id === e.id;
        const spine = e.weight === 'spine';
        const stroke = active ? G.gold : spine ? alpha(G.gold, 0.6) : G.textFaint;
        const width = (spine ? 3.5 : 2) + (active ? 1.5 : 0) + (isSel ? 0.5 : 0);
        const marker = active ? 'active' : spine ? 'spine' : 'dim';
        const label = `${spec.label}: ${nameOf(e.from)} to ${nameOf(e.to)}`;
        const select = () => onSelect({ kind: 'edge', id: e.id });
        return (
          <g
            key={e.id}
            data-edge={e.id}
            data-active={active ? 'true' : 'false'}
            data-selected={isSel ? 'true' : 'false'}
            role="button"
            tabIndex={0}
            aria-label={label}
            aria-pressed={isSel}
            onClick={select}
            onKeyDown={activate(select)}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            {/* fat transparent hit path so the edge is tappable on a phone */}
            <path d={e.d} fill="none" stroke="transparent" strokeWidth={22} style={{ pointerEvents: 'stroke' }} />
            {isSel && <path d={e.d} fill="none" stroke={alpha(G.text, 0.35)} strokeWidth={width + 6} strokeLinecap="round" />}
            <path d={e.d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" markerEnd={`url(#stack-arrow-${marker})`} style={{ transition: 'stroke .25s, stroke-width .25s' }} />
            <text
              x={e.labelX} y={e.labelY} textAnchor={e.labelAnchor}
              fontSize="9" fontFamily={MONO} letterSpacing="0.5"
              fill={active ? G.gold : G.textDim}
              style={{ paintOrder: 'stroke', stroke: G.bg, strokeWidth: 3, strokeLinejoin: 'round' }}
            >{spec.label}</text>
          </g>
        );
      })}

      {Object.values(layout.nodes).map(n => {
        const pos = n.pos;
        const fn = fnAt(pos);
        const color = colorOf(pos);
        const captured = capturedSet.has(pos);
        const just = state.justCaptured === pos;
        const isSel = selected?.kind === 'node' && selected.id === pos;
        const capLevel = captureLevelOf(pos);
        const label = positionLabel(pos, capLevel) + (fn ? ` · ${fn}` : '');
        const select = () => onSelect({ kind: 'node', id: pos });
        const showBadge = pos === 4 && fixationType != null;
        return (
          <g
            key={pos}
            data-pos={pos}
            data-captured={captured ? 'true' : 'false'}
            data-just-captured={just ? 'true' : 'false'}
            data-selected={isSel ? 'true' : 'false'}
            {...(fn ? { 'data-fn': fn } : {})}
            role="button"
            tabIndex={0}
            aria-label={label}
            aria-pressed={isSel}
            onClick={select}
            onKeyDown={activate(select)}
            style={{ cursor: 'pointer', outline: 'none' }}
          >
            {isSel && <rect x={n.x - 3} y={n.y - 3} width={n.w + 6} height={n.h + 6} rx={12} fill="none" stroke={alpha(G.text, 0.5)} strokeWidth={1.5} />}
            <rect
              className={just ? 'stack-pulse' : undefined}
              x={n.x} y={n.y} width={n.w} height={n.h} rx={10}
              fill={captured ? alpha(color, 0.22) : G.bg3}
              stroke={captured ? color : alpha(color, 0.45)}
              strokeWidth={captured ? 2 : 1.25}
              style={{ transition: 'fill .3s, stroke .3s' }}
            />
            <text x={n.x + 10} y={n.y + 18} fontSize="11" fontFamily={MONO} fontWeight="500" fill={color} letterSpacing="1">
              {pos} · {n.name.toUpperCase()}
            </text>
            <text x={n.x + n.w - 8} y={n.y + 56} textAnchor="end" fontSize="8" fontFamily={MONO} fill={captured ? color : G.textFaint}>
              Lv {capLevel}
            </text>
            {fn ? (
              <>
                <rect x={n.x + 10} y={n.y + 27} width={30} height={16} rx={8} fill={alpha(color, 0.18)} />
                <text x={n.x + 25} y={n.y + 39} textAnchor="middle" fontSize="10" fontFamily={MONO} fontWeight="500" fill={color}>{fn}</text>
                <text x={n.x + 46} y={n.y + 39} fontSize="9" fill={G.textDim}>{captured ? 'captured' : 'native'}</text>
              </>
            ) : (
              <text x={n.x + 10} y={n.y + 39} fontSize="9" fill={G.textDim}>{captured ? 'captured' : 'native'}</text>
            )}
            <text x={n.x + 10} y={n.y + 56} fontSize="9" fill={G.textFaint}>{CLASSIFICATION[pos]}</text>
            {showBadge && (
              <g>
                <rect x={n.cx - 52} y={n.y + n.h - 8} width={104} height={16} rx={8} fill={G.bg} stroke={color} strokeWidth={1} />
                <text x={n.cx} y={n.y + n.h + 3.5} textAnchor="middle" fontSize="8.5" fontFamily={MONO} fill={color}>
                  {fillTemplate(LABEL_TEMPLATES.hungerBadge, { type: fixationType })}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
