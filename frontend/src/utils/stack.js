/**
 * stack.js — Pure helpers for the Stack view: capture state per level, label
 * templating, deep-link parsing, saved-result reading, and diagram geometry.
 * No React, no DOM (localStorage access is guarded).
 */

import { MBTI_TYPES } from '../data/mbti.js';
import { COG_FUNCTIONS } from '../data/cognitive.js';
import { POSITIONS } from '../data/shadow.js';
import { getFullStack } from './shadow.js';
import { CAPTURE_ORDER, ACTIVE_EDGES, EDGES, COUNTER_THREAT_OUTPUT, LABEL_TEMPLATES } from '../data/stack.js';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 9;

export function clampLevel(level) {
  const n = Number(level);
  if (!Number.isFinite(n)) return MIN_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(MIN_LEVEL, Math.round(n)));
}

/** Level at which a position is captured (2–9). */
export function captureLevelOf(pos) {
  for (let l = MIN_LEVEL; l <= MAX_LEVEL; l++) if (CAPTURE_ORDER[l].pos === pos) return l;
  return null;
}

/** Positions captured at or before `level`, in capture order. Empty at level 1. */
export function capturedAt(level) {
  const l = clampLevel(level);
  const out = [];
  for (let i = MIN_LEVEL; i <= l; i++) if (CAPTURE_ORDER[i].pos != null) out.push(CAPTURE_ORDER[i].pos);
  return out;
}

export function isCaptured(pos, level) {
  return capturedAt(level).includes(pos);
}

export function captureState(level) {
  const l = clampLevel(level);
  return {
    level: l,
    band: CAPTURE_ORDER[l].band,
    justCaptured: CAPTURE_ORDER[l].pos,
    captured: capturedAt(l),
    activeEdges: ACTIVE_EDGES[l],
  };
}

/** Riso-Hudson level → LEVELS tier key. */
export function tierForLevel(level) {
  const l = clampLevel(level);
  return l <= 3 ? 'healthy' : l <= 6 ? 'average' : 'unhealthy';
}

/** Replace {key} placeholders; unknown placeholders are left intact. */
export function fillTemplate(str, vars = {}) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

export function positionLabel(pos, level) {
  const name = POSITIONS[pos - 1]?.name ?? `#${pos}`;
  return level == null
    ? fillTemplate(LABEL_TEMPLATES.positionOnly, { pos, name })
    : fillTemplate(LABEL_TEMPLATES.positionLevel, { pos, name, level });
}

/** Header line naming the function at a position: 'Extraverted Thinking (Te) at Refuge'. */
export function fnAtPositionLabel(fn, pos) {
  const name = POSITIONS[pos - 1]?.name ?? `#${pos}`;
  return fillTemplate(LABEL_TEMPLATES.fnAtPosition, { fn, fnName: COG_FUNCTIONS[fn]?.name ?? fn, name });
}

/** Parse `type=ENFP&level=5`. Unknown types and out-of-range levels become null. */
export function parseStackQuery(query) {
  const out = { type: null, level: null };
  if (!query) return out;
  let params;
  try { params = new URLSearchParams(query); } catch { return out; }
  const t = (params.get('type') || '').toUpperCase();
  if (MBTI_TYPES[t]) out.type = t;
  const lv = params.get('level');
  if (lv != null && /^\d+$/.test(lv)) {
    const n = Number(lv);
    if (n >= MIN_LEVEL && n <= MAX_LEVEL) out.level = n;
  }
  return out;
}

function readJSON(key) {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && typeof v === 'object' ? v : null;
  } catch {
    return null;
  }
}

/** Saved MBTI type and Enneagram core type from the Typer, or nulls. Never throws. */
export function readSavedTypes() {
  const mbti = readJSON('typer_mbti');
  const enn = readJSON('typer_enn');
  const type = typeof mbti?.result === 'string' && MBTI_TYPES[mbti.result] ? mbti.result : null;
  const core = Number(enn?.coreType);
  return { mbti: type, enn: Number.isInteger(core) && core >= 1 && core <= 9 ? core : null };
}

/** The Counter function of a type and its threat-output form. */
export function counterThreatOutput(type) {
  const stack = type ? getFullStack(type) : null;
  if (!stack) return null;
  const fn = stack[4].fn;
  return { fn, form: COUNTER_THREAT_OUTPUT[fn] };
}

// ---------------------------------------------------------------------------
// Geometry. Portrait viewBox, ego arc descending on the left, shadow arc on the
// right. Cross-column edges are cubic Béziers with horizontal tangents that stay
// inside the channel between the columns, so they never enter a node body.

export function bezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return { x: a * p0.x + b * p1.x + c * p2.x + d * p3.x, y: a * p0.y + b * p1.y + c * p2.y + d * p3.y };
}

const VIEW_W = 360, VIEW_H = 512;
const NODE_W = 120, NODE_H = 68;
const EGO_X = 12, SHADOW_X = VIEW_W - 12 - NODE_W; // 228 → channel is x ∈ (132, 228)
const ROW_Y = [28, 160, 292, 424];
const ATTACH_OFFSET = 12; // keeps two edges on one node side from sharing a point

// Where each edge leaves/enters its nodes, and where its label sits along it.
const ROUTES = {
  gate:      { from: 'top',   to: 'bottom', t: 0.5,  dx: 6,  dy: 4,  anchor: 'start' },
  writeback: { from: 'left',  to: 'right',  t: 0.5,  dx: 0,  dy: -7, anchor: 'middle', fromDy: -ATTACH_OFFSET, toDy: -ATTACH_OFFSET },
  check:     { from: 'right', to: 'left',   t: 0.72, dx: 0,  dy: 12, anchor: 'middle', fromDy: ATTACH_OFFSET },
  sample:    { from: 'right', to: 'left',   t: 0.28, dx: 0,  dy: -8, anchor: 'middle', toDy: ATTACH_OFFSET },
  monitor:   { from: 'right', to: 'left',   t: 0.1,  dx: 8,  dy: -6, anchor: 'start' },
  trigger:   { from: 'right', to: 'left',   t: 0.1,  dx: 8,  dy: 12, anchor: 'start' },
};

function sidePoint(node, side, dy = 0) {
  switch (side) {
    case 'top':    return { x: node.cx, y: node.y };
    case 'bottom': return { x: node.cx, y: node.y + node.h };
    case 'left':   return { x: node.x, y: node.cy + dy };
    default:       return { x: node.x + node.w, y: node.cy + dy };
  }
}

export function stackLayout() {
  const nodes = {};
  POSITIONS.forEach(({ pos, name, arc }) => {
    const col = arc === 'ego' ? 'ego' : 'shadow';
    const row = (pos - 1) % 4;
    const x = col === 'ego' ? EGO_X : SHADOW_X;
    const y = ROW_Y[row];
    nodes[pos] = { pos, name, arc, col, row, x, y, w: NODE_W, h: NODE_H, cx: x + NODE_W / 2, cy: y + NODE_H / 2 };
  });

  const edges = EDGES.map(e => {
    const r = ROUTES[e.id];
    const a = nodes[e.from], b = nodes[e.to];
    const p0 = sidePoint(a, r.from, r.fromDy);
    const p3 = sidePoint(b, r.to, r.toDy);
    const vertical = r.from === 'top' || r.from === 'bottom';
    const p1 = vertical ? { x: p0.x, y: (p0.y * 2 + p3.y) / 3 } : { x: (p0.x + p3.x) / 2, y: p0.y };
    const p2 = vertical ? { x: p3.x, y: (p0.y + p3.y * 2) / 3 } : { x: (p0.x + p3.x) / 2, y: p3.y };
    const lp = bezierPoint(p0, p1, p2, p3, r.t);
    const d = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;
    return {
      id: e.id, from: e.from, to: e.to, label: e.label, weight: e.weight,
      p0, p1, p2, p3, d,
      labelX: lp.x + r.dx, labelY: lp.y + r.dy, labelAnchor: r.anchor,
    };
  });

  return { viewBox: [0, 0, VIEW_W, VIEW_H], nodes, edges };
}
