'use strict';
// Bantay Proyekto — demonstration prototype.
// Every project, contractor, score, image and verification below is FICTIONAL / SIMULATED.

const STORE_KEY = 'bp-demo-v1';
const PAGE_SIZE = 10;

const SIGNALS = {
  noChange: { label: 'Limited visible construction change since contract date', kind: 'visual' },
  partial:  { label: 'Visible change smaller than the contracted scope', kind: 'visual' },
  minor:    { label: 'Minor unexplained differences near the alignment', kind: 'visual' },
  reported: { label: 'Reported "Completed" without sufficient visible evidence', kind: 'data' },
  location: { label: 'Inconsistent or imprecise project coordinates', kind: 'data' },
  overdue:  { label: 'Past target completion date with little visible progress', kind: 'data' },
  imagery:  { label: 'Insufficient, cloudy or outdated imagery', kind: 'quality' },
};
const KIND_LABEL = { visual: 'Simulated visual signal', data: 'Record consistency check', quality: 'Imagery quality' };

const VSTATUS = {
  pending:      { label: 'Pending', cls: 'st-pending', color: '#8a94a3' },
  review:       { label: 'Under Review', cls: 'st-review', color: '#6741d9' },
  confirmed:    { label: 'Verified — Construction Confirmed', cls: 'st-confirmed', color: '#1c64d6', final: true },
  discrepancy:  { label: 'Verified — Discrepancy Found', cls: 'st-discrepancy', color: '#c92a2a', final: true },
  inconclusive: { label: 'Inconclusive', cls: 'st-inconclusive', color: '#a3a37a' },
};
const RISK = {
  high:   { label: 'High risk', color: '#c2410c' },
  medium: { label: 'Medium risk', color: '#c88a00' },
  low:    { label: 'Low risk', color: '#2e7d32' },
};

const CONTRACTORS = [
  'Alpha Demo Builders (fictional)', 'Bravo Sample Construction (fictional)', 'Charlie Placeholder Works (fictional)',
  'Delta Mock Engineering (fictional)', 'Echo Test Contractors (fictional)', 'Foxtrot Example Corp. (fictional)',
];

// [n, name, municipality, province, lat, lng, contractor#, amount, contractDate, targetDate, reported, quality, cloud%, signals, status, history]
const SEED = [
  [1, 'Riverbank Revetment, Segment A', 'Hagonoy', 'Bulacan', 14.8285, 120.7372, 0, 96450000, '2023-02-14', '2024-03-30', 'Completed', 'Good', 6,
    [['noChange', 42], ['reported', 34], ['location', 16]], 'pending'],
  [2, 'Coastal Dike Rehabilitation, Phase 1', 'Masantol', 'Pampanga', 14.8905, 120.7121, 1, 148200000, '2022-09-05', '2023-12-15', 'Completed', 'Fair', 22,
    [['noChange', 38], ['reported', 30], ['location', 10], ['imagery', 9]], 'review',
    [['2026-08-20', 'review', 'Demo analyst', 'Assigned for simulated desk review; requesting a clearer imagery pass.']]],
  [3, 'Drainage Channel Improvement', 'Paombong', 'Bulacan', 14.8371, 120.7845, 2, 72800000, '2023-06-19', '2024-06-30', 'Completed', 'Good', 9,
    [['noChange', 36], ['reported', 30], ['minor', 15]], 'discrepancy',
    [['2026-07-02', 'review', 'Demo analyst', 'Queued for simulated field visit.'],
     ['2026-07-28', 'discrepancy', 'Demo inspector', 'Simulated site visit: no channel works found at the reported coordinates. Demo record only — not an official finding.']]],
  [4, 'River Embankment Strengthening', 'Calumpit', 'Bulacan', 14.9102, 120.7698, 3, 118900000, '2022-11-21', '2024-01-31', 'Completed', 'Poor', 68,
    [['imagery', 30], ['noChange', 26], ['reported', 20]], 'inconclusive',
    [['2026-06-15', 'inconclusive', 'Demo inspector', 'Simulated visit postponed: site flooded. Imagery too cloudy to conclude; radar pass recommended.']]],
  [5, 'Seawall, Section C', 'Obando', 'Bulacan', 14.7062, 120.9318, 1, 64350000, '2024-01-08', '2024-12-20', 'Completed', 'Fair', 25,
    [['reported', 28], ['partial', 25], ['location', 20]], 'pending'],
  [6, 'Floodgate and Floodwall Package', 'Bulakan', 'Bulacan', 14.7887, 120.8851, 4, 88000000, '2024-03-11', '2025-03-31', 'Ongoing', 'Good', 8,
    [['overdue', 35], ['noChange', 28], ['location', 8]], 'pending'],
  [7, 'Tidal Flood Control Structure', 'Macabebe', 'Pampanga', 14.9121, 120.7205, 5, 54600000, '2023-04-03', '2024-02-28', 'Completed', 'Poor', 57,
    [['imagery', 28], ['noChange', 20], ['reported', 16]], 'pending'],
  [8, 'Creek Slope Protection', 'Malolos', 'Bulacan', 14.8489, 120.8183, 0, 38750000, '2023-08-22', '2024-05-31', 'Completed', 'Fair', 30,
    [['partial', 26], ['reported', 22], ['minor', 10]], 'review',
    [['2026-09-10', 'review', 'Demo analyst', 'Desk review opened: comparing as-built plans with the simulated imagery.']]],
  [9, 'River Bank Protection, Segment 2', 'Marilao', 'Bulacan', 14.7621, 120.9449, 2, 45900000, '2024-06-17', '2025-06-30', 'Ongoing', 'Good', 10,
    [['overdue', 24], ['partial', 20], ['location', 8]], 'pending'],
  [10, 'Riverbank Stabilization', 'Apalit', 'Pampanga', 14.9532, 120.7614, 3, 61200000, '2022-07-25', '2023-09-30', 'Completed', 'Fair', 35,
    [['partial', 18], ['imagery', 17], ['reported', 12]], 'inconclusive',
    [['2026-05-22', 'inconclusive', 'Demo inspector', 'Simulated visit found partial works; scope boundaries unclear from available records.']]],
  [11, 'Drainage Upgrade, Package B', 'Meycauayan', 'Bulacan', 14.7389, 120.9618, 4, 29400000, '2025-01-13', '2025-11-28', 'Ongoing', 'Good', 12,
    [['overdue', 22], ['partial', 14], ['minor', 8]], 'pending'],
  [12, 'Spur Dike Series', 'Concepcion', 'Tarlac', 15.3198, 120.6589, 5, 52300000, '2023-10-02', '2024-09-30', 'Completed', 'Poor', 72,
    [['imagery', 26], ['location', 15]], 'pending'],
  [13, 'Spillway Channel Lining', 'Plaridel', 'Bulacan', 14.8851, 120.8623, 0, 83600000, '2022-08-08', '2023-07-31', 'Completed', 'Fair', 28,
    [['minor', 14], ['location', 12], ['imagery', 8]], 'confirmed',
    [['2026-04-18', 'confirmed', 'Demo inspector', 'Simulated visit: channel lining present along the reported alignment.']]],
  [14, 'Floodgate Rehabilitation', 'Pulilan', 'Bulacan', 14.9046, 120.8442, 1, 24900000, '2023-01-16', '2023-10-31', 'Completed', 'Fair', 30,
    [['minor', 16], ['imagery', 12]], 'confirmed',
    [['2026-03-30', 'confirmed', 'Demo inspector', 'Simulated visit: rehabilitated floodgate observed and operating.']]],
  [15, 'Interceptor Drainage Line', 'Baliuag', 'Bulacan', 14.9561, 120.9013, 2, 33150000, '2024-02-05', '2024-11-29', 'Completed', 'Good', 7,
    [['minor', 12], ['location', 10]], 'pending'],
  [16, 'Box Culvert Replacement', 'Guiguinto', 'Bulacan', 14.8347, 120.8812, 3, 18700000, '2025-03-03', '2025-12-19', 'Ongoing', 'Good', 11,
    [['minor', 10], ['partial', 8]], 'pending'],
  [17, 'Revetment Wall Extension', 'San Miguel', 'Bulacan', 15.1432, 120.9741, 4, 41800000, '2022-10-10', '2023-08-31', 'Completed', 'Good', 9,
    [['location', 18], ['minor', 13]], 'confirmed',
    [['2026-02-25', 'confirmed', 'Demo inspector', 'Simulated visit: revetment found ~300 m from the reported pin; coordinates corrected in demo record.']]],
  [18, 'Flood Barrier Upgrade', 'Cabiao', 'Nueva Ecija', 15.2511, 120.8605, 5, 57250000, '2022-05-16', '2023-04-28', 'Completed', 'Fair', 15,
    [['minor', 7], ['imagery', 5]], 'confirmed',
    [['2026-01-20', 'confirmed', 'Demo inspector', 'Simulated visit: barrier upgrade complete.']]],
];

const PROJECTS = SEED.map(([n, name, municipality, province, lat, lng, c, amount, contractDate, targetDate, reportedStatus, quality, cloud, sig, status, hist = []]) => {
  const signals = sig.map(([key, weight]) => ({ key, weight, ...SIGNALS[key] }));
  const history = hist.map(([date, st, by, note]) => ({ date, status: st, by, note }));
  return {
    id: `BP-DEMO-${String(n).padStart(3, '0')}`, name, municipality, province, lat, lng,
    contractor: CONTRACTORS[c], amount, contractDate, targetDate, reportedStatus, quality, cloud, signals,
    ghostScore: signals.reduce((s, x) => s + x.weight, 0), // score = sum of its explained signals
    change: sig.some(s => s[0] === 'noChange') ? 'none' : sig.some(s => s[0] === 'partial') ? 'partial' : 'full',
    seedHistory: history,
    verification: { status, history },
  };
});
const byId = id => PROJECTS.find(p => p.id === id);

// ---------- persistence ----------
function loadStore() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
}
function saveStore() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch { /* storage blocked: state lives for this session only */ }
}
const store = loadStore();
store.verif ||= {};
store.activity ||= [];
for (const p of PROJECTS) if (store.verif[p.id]) p.verification = store.verif[p.id];

const state = {
  filters: { q: '', province: '', municipality: '', risk: '', status: '', hidden: new Set() },
  sort: { key: 'ghostScore', dir: 'desc' },
  page: 0,
  selectedId: null,
  view: 'overview',
  evMode: 'side',
  showVerified: false,
  thresholds: store.thresholds || { high: 70, med: 40 },
};

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pesoFmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 });
const pesoShortFmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', notation: 'compact', maximumFractionDigits: 1 });
const peso = n => pesoFmt.format(n);
const pesoShort = n => pesoShortFmt.format(n);
const fmtDate = iso => iso ? new Date(iso + 'T00:00:00').toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
const addDays = (iso, d) => { const t = new Date(iso + 'T00:00:00'); t.setDate(t.getDate() + d); return localISO(t); };
const localISO = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const today = () => localISO(new Date());

function riskLevel(score) {
  const t = state.thresholds;
  return score >= t.high ? 'high' : score >= t.med ? 'medium' : 'low';
}
const isFinal = p => !!VSTATUS[p.verification.status].final;
const riskBadge = p => { const r = riskLevel(p.ghostScore); return `<span class="badge risk-${r}">${RISK[r].label}</span>`; };
const scorePill = p => `<span class="score risk-${riskLevel(p.ghostScore)}" title="Ghost Score (simulated)">${p.ghostScore}</span>`;
const statusBadge = p => { const v = VSTATUS[p.verification.status]; return `<span class="badge ${v.cls}">${v.label}</span>`; };
const topSignal = p => [...p.signals].sort((a, b) => b.weight - a.weight)[0];

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------- filtering / sorting / export ----------
function filtered() {
  const f = state.filters, q = f.q.trim().toLowerCase();
  return PROJECTS.filter(p => {
    const r = riskLevel(p.ghostScore);
    if (f.hidden.has(r) || (f.risk && f.risk !== r)) return false;
    if (f.province && p.province !== f.province) return false;
    if (f.municipality && p.municipality !== f.municipality) return false;
    if (f.status) {
      const [kind, val] = f.status.split(':');
      if (kind === 'r' ? p.reportedStatus !== val : p.verification.status !== val) return false;
    }
    return !q || `${p.id} ${p.name} ${p.municipality} ${p.province} ${p.contractor}`.toLowerCase().includes(q);
  });
}
const filtersActive = () => { const f = state.filters; return !!(f.q || f.province || f.municipality || f.risk || f.status || f.hidden.size); };

function sorted(list) {
  const { key, dir } = state.sort, m = dir === 'asc' ? 1 : -1;
  return [...list].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * m || b.ghostScore - a.ghostScore);
}

function toCSV(list) {
  const head = ['Project ID', 'Project name', 'Municipality', 'Province', 'Latitude', 'Longitude', 'Contractor', 'Contract amount (PHP)',
    'Contract date', 'Target completion', 'Reported status', 'Ghost Score', 'Risk level', 'Verification status', 'Evidence quality', 'Notice'];
  const rows = list.map(p => [p.id, p.name, p.municipality, p.province, p.lat, p.lng, p.contractor, p.amount, p.contractDate, p.targetDate,
    p.reportedStatus, p.ghostScore, RISK[riskLevel(p.ghostScore)].label, VSTATUS[p.verification.status].label,
    `${p.quality} (${p.cloud}% cloud)`, 'SIMULATED DEMO DATA - fictional, not an official finding']);
  return [head, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
}
function exportCSV() {
  const list = sorted(filtered());
  if (!list.length) return toast('No records match the current filters — nothing to export.');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + toCSV(list)], { type: 'text/csv;charset=utf-8' }));
  a.download = `bantay-proyekto-demo-${today()}.csv`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(`Exported ${list.length} demo record${list.length === 1 ? '' : 's'} to CSV.`);
}

// ---------- scoring explanations ----------
function nextAction(p) {
  const s = p.verification.status, r = riskLevel(p.ghostScore);
  const loc = p.signals.some(x => x.key === 'location') ? '; confirm coordinates with the implementing office' : '';
  if (s === 'confirmed') return 'No action needed — keep on the public map with its evidence';
  if (s === 'discrepancy') return 'Refer the simulated discrepancy for audit review (demo workflow only)';
  if (p.quality === 'Poor') return 'Get clearer imagery first (Sentinel-1 radar or 5 m MULA/commercial) before dispatching an inspector' + loc;
  if (s === 'inconclusive') return 'Schedule a repeat check with new imagery or a site visit' + loc;
  if (r === 'high') return 'Prioritize for physical field inspection' + loc;
  if (r === 'medium') return 'Desk review: check records and request additional imagery' + loc;
  return 'Routine monitoring — re-screen on the next imagery pass' + loc;
}
const imageDates = p => ({ before: addDays(p.contractDate, -60), after: addDays(p.targetDate, 60) });
function aiSummary(p) {
  const d = imageDates(p);
  const change = { none: 'no clear new structure', partial: 'some new works, smaller than the contracted scope', full: 'visible new works consistent with the contract' }[p.change];
  const quality = p.quality === 'Poor'
    ? ` Image quality is poor (${p.cloud}% cloud), so confidence is low — this must not be read as evidence that nothing was built.`
    : p.quality === 'Fair' ? ` Image quality is fair (${p.cloud}% cloud); confidence is moderate.` : ' Image quality is good; confidence is relatively high.';
  return `Comparing the ${fmtDate(d.before)} and ${fmtDate(d.after)} scenes, the simulated model sees ${change} at the reported location. ` +
    `The largest contributor to the score is "${topSignal(p).label.toLowerCase()}".${quality}`;
}

// ---------- illustrative satellite-style tiles ----------
function rng(seed) { // mulberry32
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const hash = s => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);
const FIELDS = ['#6b7c4a', '#7d8c55', '#59693e', '#8a8a5c', '#6f6a45', '#4f5f38', '#8f9a62'];

function satSVG(p, phase) {
  const r = rng(hash(p.id));
  const uid = `${p.id}-${phase}`;
  let s = `<svg viewBox="0 0 400 260" class="sat" role="img" aria-label="Illustrative ${phase} scene, not real satellite imagery"><rect width="400" height="260" fill="#5d6b45"/>`;
  for (let y = 0; y < 260; y += 40) for (let x = 0; x < 400; x += 50)
    s += `<rect x="${(x + r() * 4).toFixed(1)}" y="${(y + r() * 4).toFixed(1)}" width="${(43 + r() * 6).toFixed(1)}" height="${(33 + r() * 6).toFixed(1)}" fill="${FIELDS[Math.floor(r() * FIELDS.length)]}"/>`;
  const y1 = 70 + r() * 40, y2 = 110 + r() * 60;
  const river = `M-10 ${y1.toFixed(1)} C 120 ${(y1 + 60).toFixed(1)}, 260 ${(y2 - 70).toFixed(1)}, 410 ${y2.toFixed(1)}`;
  const ry = (y1 + y2) / 2 - 3.75; // river centre at x=200
  const rx1 = 60 + r() * 80, rx2 = 100 + r() * 120;
  s += `<path d="${river}" stroke="#2e4b57" stroke-width="26" fill="none"/>`;
  s += `<path d="M ${rx1.toFixed(1)} -10 L ${rx2.toFixed(1)} 270" stroke="#b9b4a5" stroke-width="5"/>`;
  for (let i = 0; i < 14; i++) s += `<rect x="${(rx1 + 8 + r() * 60).toFixed(1)}" y="${(r() * 250).toFixed(1)}" width="6" height="5" fill="#cfc8b8"/>`;
  if (phase === 'after') {
    if (p.change === 'full') s += `<path d="${river}" stroke="#dcd8cc" stroke-width="5" fill="none" transform="translate(0,-17)"/>`;
    if (p.change === 'partial') s += `<ellipse cx="150" cy="${(ry - 22).toFixed(1)}" rx="40" ry="10" fill="#a08a63"/><path d="${river}" pathLength="100" stroke-dasharray="0 35 22 100" stroke="#dcd8cc" stroke-width="5" fill="none" transform="translate(0,-17)"/>`;
  }
  const clouds = phase === 'after' ? p.cloud : Math.min(p.cloud, 15);
  if (clouds > 12) {
    s += `<defs><filter id="blur-${uid}"><feGaussianBlur stdDeviation="9"/></filter></defs><g filter="url(#blur-${uid})" fill="#fff" opacity="${Math.min(0.95, clouds / 70).toFixed(2)}">`;
    for (let i = 0; i < Math.round(clouds / 8); i++) s += `<ellipse cx="${(r() * 400).toFixed(1)}" cy="${(r() * 260).toFixed(1)}" rx="${(30 + r() * 60).toFixed(1)}" ry="${(18 + r() * 30).toFixed(1)}"/>`;
    s += '</g>';
  }
  const cy = (ry - 17).toFixed(1);
  s += `<circle cx="200" cy="${cy}" r="22" fill="none" stroke="#ffb703" stroke-width="2" stroke-dasharray="4 3"/><path d="M200 ${cy - 30}v12M200 ${+cy + 18}v12M170 ${cy}h12M218 ${cy}h12" stroke="#ffb703" stroke-width="2"/>`;
  s += `<text x="8" y="252" class="wm">ILLUSTRATIVE · NOT REAL SATELLITE IMAGERY</text></svg>`;
  return s;
}

// ---------- filters UI ----------
const provinces = [...new Set(PROJECTS.map(p => p.province))].sort();
const reportedStatuses = [...new Set(PROJECTS.map(p => p.reportedStatus))].sort();
const opt = (v, label, sel) => `<option value="${esc(v)}"${v === sel ? ' selected' : ''}>${esc(label)}</option>`;

function municipalityOptions() {
  const f = state.filters;
  const munis = [...new Set(PROJECTS.filter(p => !f.province || p.province === f.province).map(p => p.municipality))].sort();
  return opt('', 'All municipalities', f.municipality) + munis.map(m => opt(m, m, f.municipality)).join('');
}
function buildFilters() {
  const f = state.filters, t = state.thresholds;
  const html = `
    <label class="field"><span>Search</span><input type="search" data-f="q" placeholder="Name, ID, municipality, contractor" value="${esc(f.q)}"></label>
    <label class="field"><span>Province</span><select data-f="province">${opt('', 'All provinces', f.province)}${provinces.map(v => opt(v, v, f.province)).join('')}</select></label>
    <label class="field"><span>Municipality</span><select data-f="municipality">${municipalityOptions()}</select></label>
    <label class="field"><span>Risk level</span><select data-f="risk">${opt('', 'All risk levels', f.risk)}${opt('high', `High (${t.high}–100)`, f.risk)}${opt('medium', `Medium (${t.med}–${t.high - 1})`, f.risk)}${opt('low', `Low (0–${t.med - 1})`, f.risk)}</select></label>
    <label class="field"><span>Status</span><select data-f="status">${opt('', 'Any status', f.status)}
      <optgroup label="Reported status">${reportedStatuses.map(s => opt('r:' + s, s, f.status)).join('')}</optgroup>
      <optgroup label="Verification (simulated)">${Object.entries(VSTATUS).map(([k, v]) => opt('v:' + k, v.label, f.status)).join('')}</optgroup></select></label>
    <fieldset class="field toggles"><legend>Show risk bands</legend><div class="opts">
      ${['high', 'medium', 'low'].map(r => `<label class="chip"><input type="checkbox" data-band="${r}"${f.hidden.has(r) ? '' : ' checked'}>${r[0].toUpperCase() + r.slice(1)}</label>`).join('')}</div></fieldset>
    <button type="button" class="btn" data-action="reset-filters"><span class="msi" aria-hidden="true">restart_alt</span>Reset filters</button>`;
  $$('[data-filters]').forEach(el => { el.innerHTML = html; });
}
function syncFilterInputs(except) {
  const f = state.filters;
  $$('[data-f]').forEach(el => {
    if (el === except) return;
    if (el.dataset.f === 'municipality') el.innerHTML = municipalityOptions();
    el.value = f[el.dataset.f];
  });
  $$('[data-band]').forEach(el => { el.checked = !f.hidden.has(el.dataset.band); });
}
function resetFilters() {
  Object.assign(state.filters, { q: '', province: '', municipality: '', risk: '', status: '', hidden: new Set() });
  state.page = 0;
  syncFilterInputs();
  renderAll();
  for (const m of Object.values(maps)) fitMap(m);
}

// ---------- Overview ----------
function renderOverview() {
  const list = filtered();
  const count = st => list.filter(p => p.verification.status === st).length;
  const high = list.filter(p => riskLevel(p.ghostScore) === 'high').length;
  $('#kpis').innerHTML = [
    ['', 'Total projects screened', list.length, `Demo records${filtersActive() ? ' matching current filters' : ''} with a simulated Ghost Score`],
    ['high', 'High-risk projects', high, `Ghost Score ≥ ${state.thresholds.high}`],
    ['wait', 'Awaiting verification', count('pending') + count('review'), 'Pending or Under Review'],
    ['ver', 'Verified projects', count('confirmed') + count('discrepancy'), 'Construction confirmed or discrepancy found (simulated)'],
  ].map(([cls, label, val, def]) => `<div class="kpi ${cls}"><div class="label">${label}</div><div class="val">${val}</div><div class="def">${def}</div></div>`).join('');

  // risk distribution histogram (10-point bins)
  const bins = Array(10).fill(0);
  list.forEach(p => bins[Math.min(9, Math.floor(p.ghostScore / 10))]++);
  const max = Math.max(1, ...bins), W = 320, H = 150, bw = 28;
  let svg = `<svg viewBox="0 0 ${W} ${H + 34}" role="img" aria-label="Histogram of Ghost Scores">`;
  bins.forEach((n, i) => {
    const h = n / max * H, x = 6 + i * 31, r = riskLevel(i * 10 + 5);
    svg += `<rect x="${x}" y="${H - h + 12}" width="${bw}" height="${Math.max(h, n ? 2 : 0)}" rx="4" fill="${RISK[r].color}"><title>${i * 10}–${i * 10 + 9}: ${n} project(s)</title></rect>`;
    if (n) svg += `<text x="${x + bw / 2}" y="${H - h + 8}" text-anchor="middle">${n}</text>`;
    svg += `<text x="${x + bw / 2}" y="${H + 26}" text-anchor="middle">${i * 10}</text>`;
  });
  svg += `<line x1="4" x2="${W - 4}" y1="${H + 12}" y2="${H + 12}" style="stroke:var(--md-outline-variant)"/></svg>`;
  $('#chart-dist').innerHTML = list.length
    ? `<div class="chart">${svg}</div><ul class="legend-list">${['high', 'medium', 'low'].map(r => `<li><span class="dot" style="background:${RISK[r].color}"></span>${RISK[r].label}<b>${list.filter(p => riskLevel(p.ghostScore) === r).length}</b></li>`).join('')}</ul>`
    : emptyHTML('No projects', 'No projects match the current filters.');

  const total = list.length || 1;
  const reported = reportedStatuses.map(s => `${s}: <b>${list.filter(p => p.reportedStatus === s).length}</b>`).join(' · ');
  $('#chart-status').innerHTML = `
    <div class="small muted">Verification status (simulated)</div>
    <div class="stack">${Object.entries(VSTATUS).map(([k, v]) => `<span style="width:${count(k) / total * 100}%;background:${v.color}" title="${v.label}: ${count(k)}"></span>`).join('')}</div>
    <ul class="legend-list">${Object.entries(VSTATUS).map(([k, v]) => `<li><span class="dot" style="background:${v.color}"></span>${v.label}<b>${count(k)}</b></li>`).join('')}</ul>
    <p class="small muted" style="margin:12px 0 0">Reported by implementing office — ${reported}</p>`;

  const top = [...list].sort((a, b) => b.ghostScore - a.ghostScore).slice(0, 5);
  $('#top-risk').innerHTML = top.length ? `<ul class="rows">${top.map(p => `<li><button class="row-btn" data-goto="${p.id}">
      ${scorePill(p)}<span><span class="t">${esc(p.name)}</span><span class="s">${p.id} · ${esc(p.municipality)}, ${esc(p.province)} · ${peso(p.amount)}</span></span>
      ${riskBadge(p)}${statusBadge(p)}</button></li>`).join('')}</ul>` : emptyHTML('No projects', 'Adjust or reset the filters.');

  const byProv = provinces.map(pr => {
    const ps = list.filter(p => p.province === pr);
    return { pr, n: ps.length, high: ps.filter(p => riskLevel(p.ghostScore) === 'high').length, amt: ps.reduce((s, p) => s + p.amount, 0), avg: ps.length ? Math.round(ps.reduce((s, p) => s + p.ghostScore, 0) / ps.length) : 0 };
  }).filter(x => x.n);
  $('#regional').innerHTML = byProv.length ? `<div class="table-wrap"><table class="data compact"><thead><tr><th><span>Province</span></th><th><span>Projects</span></th><th><span>High</span></th><th><span>Value</span></th><th><span>Avg score</span></th></tr></thead>
    <tbody>${byProv.map(x => `<tr><td>${esc(x.pr)}</td><td class="num">${x.n}</td><td class="num">${x.high}</td><td class="num">${pesoShort(x.amt)}</td><td class="num">${x.avg}</td></tr>`).join('')}</tbody></table></div>` : emptyHTML('No projects', '');

  $('#activity').innerHTML = activity().slice(0, 8).map(a => `<li><time>${fmtDate(a.date)}</time><span>${a.id ? `<a href="#project/${a.id}">${a.id}</a> · ` : ''}${esc(a.text)}</span></li>`).join('');
}
function activity() {
  const seeded = PROJECTS.flatMap(p => p.seedHistory.map(h => ({ date: h.date, id: p.id, text: `${VSTATUS[h.status].label} — ${h.by} (simulated)` })));
  seeded.push({ date: '2026-01-05', id: null, text: 'Simulated screening run scored 18 demo projects (Bulacan pilot + nearby Central Luzon).' });
  return [...store.activity, ...seeded.sort((a, b) => b.date.localeCompare(a.date))];
}
const emptyHTML = (title, msg) => `<div class="empty"><b>${esc(title)}</b>${esc(msg)}</div>`;

// ---------- Maps ----------
const maps = {};
function pinIcon(p) {
  const f = isFinal(p);
  return L.divIcon({ className: '', html: `<span class="pin pin-${riskLevel(p.ghostScore)}${f ? ' pin-verified' : ''}">${f ? '✓' : ''}</span>`, iconSize: f ? [22, 22] : [18, 18], popupAnchor: [0, -10] });
}
function popupHTML(p) {
  return `<div class="popup"><h4>${esc(p.name)}</h4><div class="muted">${p.id} · ${esc(p.municipality)}, ${esc(p.province)}</div>
    <dl><dt>Contractor</dt><dd>${esc(p.contractor)}</dd><dt>Amount</dt><dd>${peso(p.amount)}</dd><dt>Reported</dt><dd>${esc(p.reportedStatus)}</dd>
    <dt>Ghost Score</dt><dd>${scorePill(p)} ${riskBadge(p)}</dd><dt>Verification</dt><dd>${statusBadge(p)}</dd></dl>
    <button class="btn primary" data-goto="${p.id}">View full details</button><div class="small muted" style="margin-top:6px">Simulated demo record</div></div>`;
}
function fitMap(m) {
  if (!m.map) return;
  const pts = filtered().map(p => [p.lat, p.lng]);
  if (pts.length) m.map.fitBounds(pts, { padding: [30, 30], maxZoom: 13 });
}
// Esri Canvas basemaps: keyless and accept file:// pages (no Referer), unlike tile.openstreetmap.org, which blocks them.
const isDark = () => document.documentElement.dataset.theme === 'dark';
const tileUrl = () => `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${isDark() ? 'Dark' : 'Light'}_Gray_Base/MapServer/tile/{z}/{y}/{x}`;

// Leaflet caches its container size; the first fit must wait until the grid has laid the container out.
function sizeMap(m) {
  if (!m.map) return;
  m.map.invalidateSize();
  if (!m.fitted && m.map.getSize().x > 100) { m.fitted = true; fitMap(m); }
}
function initMap(key, el) {
  if (maps[key]) return maps[key];
  const m = maps[key] = { el, markers: {} };
  if (!window.L) { m.failed = true; return m; }
  m.map = L.map(el, { scrollWheelZoom: key === 'main', zoomControl: true }).setView([14.95, 120.85], 10);
  let loaded = 0, errors = 0;
  const tiles = m.tiles = L.tileLayer(tileUrl(), {
    maxZoom: 16, attribution: 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
  }).addTo(m.map);
  tiles.on('tileload', () => loaded++);
  tiles.on('tileerror', () => {
    if (++errors >= 4 && !loaded && !m.notice) {
      m.notice = true;
      el.insertAdjacentHTML('beforeend', '<div class="map-notice"><b>Basemap tiles could not load.</b> Markers still work; the project list beside the map remains usable.</div>');
    }
  });
  m.layer = L.layerGroup().addTo(m.map);
  new ResizeObserver(() => sizeMap(m)).observe(el);
  return m;
}
function renderMap(key, elId) {
  const el = document.getElementById(elId);
  if (!el.offsetParent) return; // view hidden; rendered when shown
  const m = initMap(key, el), list = filtered();
  if (m.failed) {
    el.innerHTML = `<div class="map-fallback"><b>Interactive map unavailable.</b> <span class="muted">The map library or network could not load. Project locations are listed instead.</span>
      ${list.length ? `<ul>${list.map(p => `<li><button data-goto="${p.id}">${scorePill(p)} <b>${esc(p.name)}</b><small>${p.id} · ${esc(p.municipality)}, ${esc(p.province)} · ${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}</small></button></li>`).join('')}</ul>` : emptyHTML('No projects', 'No projects match the current filters.')}</div>`;
    return;
  }
  sizeMap(m);
  m.layer.clearLayers();
  m.markers = {};
  for (const p of list) {
    m.markers[p.id] = L.marker([p.lat, p.lng], { icon: pinIcon(p), title: `${p.id} ${p.name}`, alt: p.name, riseOnHover: true })
      .bindPopup(popupHTML(p)).addTo(m.layer);
  }
}
function renderLegend() {
  const t = state.thresholds;
  $('#map-legend').innerHTML = `<span><i class="pin pin-high"></i>High (${t.high}–100)</span><span><i class="pin pin-medium"></i>Medium (${t.med}–${t.high - 1})</span>
    <span><i class="pin pin-low"></i>Low (0–${t.med - 1})</span><span><i class="pin pin-low pin-verified">✓</i>Verified (simulated)</span>
    <span class="muted">Locations are fictional demo coordinates.</span>`;
}
function renderMapList() {
  const list = sorted(filtered());
  $('#map-count').textContent = `${list.length} of ${PROJECTS.length}`;
  $('#map-list').innerHTML = list.length
    ? list.map(p => `<li><button data-focus="${p.id}">${scorePill(p)}<span><b>${esc(p.name)}</b><small>${p.id} · ${esc(p.municipality)}, ${esc(p.province)}</small></span></button></li>`).join('')
    : `<li>${emptyHTML('No matching projects', 'Try a different search or reset the filters.')}</li>`;
}
function focusProject(id) {
  const m = maps.main;
  if (!m || m.failed || !m.markers[id]) return go(id);
  const p = byId(id);
  m.map.setView([p.lat, p.lng], Math.max(m.map.getZoom(), 13));
  m.markers[id].openPopup();
}

// ---------- Risk table ----------
const COLS = [
  ['id', 'Project ID'], ['name', 'Project name'], [null, 'Location'], [null, 'Contractor'], ['amount', 'Contract amount'],
  ['contractDate', 'Contract date'], ['targetDate', 'Target completion'], ['reportedStatus', 'Reported status'],
  ['ghostScore', 'Ghost Score'], [null, 'Risk level'], [null, 'Verification'], [null, ''],
];
function renderTable() {
  const list = sorted(filtered());
  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  state.page = Math.min(state.page, pages - 1);
  const rows = list.slice(state.page * PAGE_SIZE, (state.page + 1) * PAGE_SIZE);
  const { key, dir } = state.sort;
  const head = COLS.map(([k, label]) => {
    if (!k) return `<th><span>${label}</span></th>`;
    const on = k === key;
    return `<th aria-sort="${on ? (dir === 'asc' ? 'ascending' : 'descending') : 'none'}"><button data-sort="${k}">${label} ${on ? (dir === 'asc' ? '▲' : '▼') : '<span class="muted">↕</span>'}</button></th>`;
  }).join('');
  const body = rows.length ? rows.map(p => `<tr data-goto="${p.id}">
      <td class="nowrap">${p.id}</td><td>${esc(p.name)}</td><td>${esc(p.municipality)}, ${esc(p.province)}</td><td>${esc(p.contractor)}</td>
      <td class="num">${peso(p.amount)}</td><td class="nowrap">${fmtDate(p.contractDate)}</td><td class="nowrap">${fmtDate(p.targetDate)}</td>
      <td>${esc(p.reportedStatus)}</td><td>${scorePill(p)}</td><td>${riskBadge(p)}</td><td>${statusBadge(p)}</td>
      <td><button class="btn sm" data-goto="${p.id}">Details</button></td></tr>`).join('')
    : `<tr><td colspan="${COLS.length}">${emptyHTML('No matching projects', 'Try a different search or reset the filters.')}</td></tr>`;
  $('#risk-table').innerHTML = `<caption class="small muted" style="text-align:left;padding:8px 10px;caption-side:bottom">Simulated Ghost Scores for fictional demo projects.</caption><thead><tr>${head}</tr></thead><tbody>${body}</tbody>`;
  $('#pager').innerHTML = `<span>${list.length ? `Showing ${state.page * PAGE_SIZE + 1}–${state.page * PAGE_SIZE + rows.length} of ${list.length}` : 'No results'}${filtersActive() ? ' (filtered)' : ''}</span>
    <div><button class="btn sm" data-page="-1"${state.page === 0 ? ' disabled' : ''}>Previous</button><span style="align-self:center">Page ${state.page + 1} / ${pages}</span><button class="btn sm" data-page="1"${state.page >= pages - 1 ? ' disabled' : ''}>Next</button></div>`;
}

// ---------- Project detail ----------
function statusButtons(p) {
  return Object.entries(VSTATUS).map(([k, v]) => {
    const cur = p.verification.status === k;
    return `<button class="btn sm${v.final ? ` ${v.cls}-btn` : ''}" data-verify="${p.id}" data-status="${k}"${cur ? ' aria-pressed="true" disabled' : ''}>${cur ? '● ' : ''}${v.final ? 'Mark ' : 'Mark as '}${v.label}</button>`;
  }).join('');
}
function gaugeSVG(p) {
  const r = riskLevel(p.ghostScore), c = 2 * Math.PI * 50, len = p.ghostScore / 100 * c;
  return `<svg class="gauge" viewBox="0 0 120 120" role="img" aria-label="Ghost Score ${p.ghostScore} of 100">
    <circle cx="60" cy="60" r="50" fill="none" style="stroke:var(--md-surface-container-highest)" stroke-width="12"/>
    <circle cx="60" cy="60" r="50" fill="none" stroke="${RISK[r].color}" stroke-width="12" stroke-linecap="round" stroke-dasharray="${len.toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 60 60)"/>
    <text x="60" y="62" text-anchor="middle" font-size="32" font-weight="400" style="fill:var(--md-on-surface)">${p.ghostScore}</text>
    <text x="60" y="80" text-anchor="middle" font-size="11" style="fill:var(--md-on-surface-variant)">/ 100</text></svg>`;
}
function evidenceHTML(p) {
  const d = imageDates(p), cap = `${esc(p.municipality)}, ${esc(p.province)} · ${p.lat.toFixed(4)}°N, ${p.lng.toFixed(4)}°E · dashed ring = reported project location`;
  const before = satSVG(p, 'before'), after = satSVG(p, 'after');
  const view = state.evMode === 'side'
    ? `<div class="ev-side"><figure>${before}<figcaption><b>Before</b> · ${fmtDate(d.before)} (before contract)</figcaption></figure>
        <figure>${after}<figcaption><b>After</b> · ${fmtDate(d.after)} (after target completion)</figcaption></figure></div>`
    : `<div class="ev-swipe" id="ev-swipe"><div>${before}</div><div class="ev-after">${after}</div><div class="ev-handle"></div>
        <span class="ev-tag l">Before · ${fmtDate(d.before)}</span><span class="ev-tag r">After · ${fmtDate(d.after)}</span></div>
       <input class="ev-range" type="range" min="0" max="100" value="50" data-swipe aria-label="Drag to compare before and after">`;
  return `<div class="ev-toolbar"><h2 style="margin:0">Satellite evidence comparison <span class="sim-tag">Illustrative</span></h2>
      <div class="seg" role="group" aria-label="Comparison mode"><button data-ev="side" aria-pressed="${state.evMode === 'side'}">Side by side</button><button data-ev="swipe" aria-pressed="${state.evMode === 'swipe'}">Swipe</button></div></div>
    ${view}<p class="ev-caption">${cap}</p>
    <p class="note">These are procedurally generated illustrations, <b>not real satellite imagery</b>. A production system would show Sentinel-2 scenes (planned integration, not connected).</p>`;
}
function renderDetail() {
  const el = $('#detail'), p = byId(state.selectedId);
  if (!p) {
    const top = [...PROJECTS].sort((a, b) => b.ghostScore - a.ghostScore).slice(0, 6);
    el.innerHTML = `<div class="view-head"><div><h1>Project Details</h1><p class="sub">Select a project from the map, the risk table, or the queue.</p></div></div>
      <div class="card">${state.selectedId ? emptyHTML('Project not found', `No demo project has the ID "${state.selectedId}".`) : emptyHTML('No project selected', 'Pick one of the highest-scoring projects below to open its evidence workspace.')}
      <ul class="rows">${top.map(p => `<li><button class="row-btn" data-goto="${p.id}">${scorePill(p)}<span><span class="t">${esc(p.name)}</span><span class="s">${p.id} · ${esc(p.municipality)}, ${esc(p.province)}</span></span>${riskBadge(p)}${statusBadge(p)}</button></li>`).join('')}</ul></div>`;
    return;
  }
  const r = riskLevel(p.ghostScore), v = p.verification;
  const groups = ['visual', 'data', 'quality'].map(k => [k, p.signals.filter(s => s.kind === k)]).filter(([, s]) => s.length);
  const quality = 100 - p.cloud;
  el.innerHTML = `
  <div class="view-head">
    <div><a href="#risk" class="back"><span class="msi" aria-hidden="true">arrow_back</span>Risk Assessment</a><h1>${esc(p.name)}</h1>
      <p class="sub">${p.id} · ${esc(p.municipality)}, ${esc(p.province)} · ${statusBadge(p)} <span class="sim-tag">Demo record</span></p></div>
    <div class="head-actions"><button class="btn tonal" data-verify="${p.id}" data-status=""><span class="msi" aria-hidden="true">edit_note</span>Add inspector note</button><a class="btn" href="#queue"><span class="msi" aria-hidden="true">fact_check</span>Open queue</a></div>
  </div>
  <div class="detail-grid">
    <div class="card"><h2>Project overview</h2><dl class="kv">
      <dt>Project ID</dt><dd>${p.id}</dd><dt>Location</dt><dd>${esc(p.municipality)}, ${esc(p.province)} (${p.lat.toFixed(4)}, ${p.lng.toFixed(4)})</dd>
      <dt>Contractor</dt><dd>${esc(p.contractor)}</dd><dt>Contract amount</dt><dd>${peso(p.amount)}</dd>
      <dt>Contract start</dt><dd>${fmtDate(p.contractDate)}</dd><dt>Expected completion</dt><dd>${fmtDate(p.targetDate)}</dd>
      <dt>Reported status</dt><dd>${esc(p.reportedStatus)} <span class="muted small">(as reported by implementing office — simulated)</span></dd>
      <dt>Verification</dt><dd>${statusBadge(p)}</dd></dl></div>
    <div class="card score-card">${gaugeSVG(p)}
      <div><h2 style="margin-bottom:4px">Ghost Score ${riskBadge(p)}</h2>
        <p class="small" style="margin:0">${r === 'high' ? 'Little visible evidence of the reported works — inspect first.' : r === 'medium' ? 'Some evidence is missing or unclear — worth a closer look.' : 'Visible evidence broadly matches the record.'}</p>
        <p class="small muted" style="margin:6px 0 0">A prioritisation indicator for inspectors — <b>not</b> a probability of wrongdoing and not proof of fraud.</p></div>
      <div class="next"><b>Recommended next action</b>${esc(nextAction(p))}</div></div>
    <div class="card" style="grid-column:1/-1">${evidenceHTML(p)}</div>
    <div class="card"><div class="layer-label"><span class="n">1</span>Signals behind the score <span class="sim-tag">Simulated</span></div>
      <ul class="signals">${groups.map(([k, ss]) => ss.map(s => `<li><div class="top"><span>${esc(s.label)}<div class="kind">${KIND_LABEL[k]}</div></span><b>+${s.weight}</b></div><div class="bar"><span style="width:${s.weight}%;background:${RISK[r].color}"></span></div></li>`).join('')).join('')}</ul>
      <p class="note">Contributions add up to the score of ${p.ghostScore}. These signals are illustrative examples of what a real model might weigh.</p></div>
    <div class="card"><div class="layer-label"><span class="n">2</span>Model-generated assessment <span class="sim-tag">Simulated</span></div>
      <p style="margin:0">${esc(aiSummary(p))}</p>
      <div class="quality"><span>Evidence quality</span><div class="bar"><span style="width:${quality}%;background:${p.quality === 'Good' ? 'var(--low)' : p.quality === 'Fair' ? 'var(--med)' : 'var(--high)'}"></span></div><b>${p.quality}</b></div>
      <div class="small muted">${p.cloud}% cloud cover over the site in the after-scene (simulated).</div>
      ${p.quality === 'Poor' ? '<p class="note warn"><b>Low image quality.</b> The score is less reliable here. Cloudy or missing imagery is not evidence that nothing was built.</p>' : ''}</div>
    <div class="card" style="grid-column:1/-1"><div class="layer-label"><span class="n">3</span>Human verification findings <span class="sim-tag">Simulated workflow</span></div>
      <div class="status-actions">${statusButtons(p)}</div>
      ${v.history.length ? `<ul class="timeline">${[...v.history].reverse().map(h => `<li><div class="meta">${fmtDate(h.date)} · ${esc(h.by)} · ${h.status ? `<span class="badge ${VSTATUS[h.status].cls}">${VSTATUS[h.status].label}</span>` : 'Inspector note'}</div>${h.note ? `<p>${esc(h.note)}</p>` : ''}</li>`).join('')}</ul>`
        : emptyHTML('No verification yet', 'No simulated inspection or inspector note has been recorded for this project.')}
      <p class="note">Verification entries in this prototype are simulated and stored only in this browser. They are not real inspections or official findings.</p></div>
  </div>`;
}

// ---------- Verification queue ----------
function renderQueue() {
  const list = filtered().filter(p => state.showVerified || !isFinal(p)).sort((a, b) => b.ghostScore - a.ghostScore);
  $('#queue').innerHTML = list.length ? list.map((p, i) => `<article class="card q-item">
      <div class="q-rank">${scorePill(p)}<small>#${i + 1} priority</small></div>
      <div><div class="q-top"><a href="#project/${p.id}">${esc(p.name)}</a><span>${riskBadge(p)} ${statusBadge(p)}</span></div>
        <div class="small muted">${p.id} · ${esc(p.municipality)}, ${esc(p.province)}</div>
        <dl class="q-meta"><div><dt>Contract value</dt><dd>${peso(p.amount)}</dd></div><div><dt>Reason for flagging</dt><dd>${esc(topSignal(p).label)}</dd></div>
          <div><dt>Evidence quality</dt><dd>${p.quality} (${p.cloud}% cloud)</dd></div><div><dt>Recommended action</dt><dd>${esc(nextAction(p))}</dd></div></dl>
        <div class="status-actions" style="margin-bottom:0">${statusButtons(p)}</div></div></article>`).join('')
    : `<div class="card">${emptyHTML('Queue is empty', filtersActive() ? 'No unverified projects match the current filters.' : 'Every demo project has a final simulated verification.')}</div>`;
}

// ---------- Verification dialog ----------
let pendingVerify = null;
function openVerify(id, status) {
  const p = byId(id), form = $('#verify-form'), fin = !!(status && VSTATUS[status].final);
  pendingVerify = { id, status: status || null };
  form.reset();
  $('#vd-title').textContent = status ? `Mark as: ${VSTATUS[status].label}` : 'Add inspector note';
  $('#vd-project').textContent = `${p.id} · ${p.name} · ${p.municipality}, ${p.province}`;
  form.date.value = today();
  form.by.value = 'Demo inspector';
  form.note.required = !status;
  form.confirm.required = fin;
  $('#vd-confirm-wrap').hidden = !fin;
  $('#verify-dialog').showModal();
}
function applyVerification(id, status, date, by, note) {
  const p = byId(id);
  p.verification = { status: status || p.verification.status, history: [...p.verification.history, { date, status, by, note }] };
  store.verif[id] = p.verification;
  store.activity.unshift({ date, id, text: status ? `Marked "${VSTATUS[status].label}" by ${by} (simulated)` : `Inspector note added by ${by} (simulated)` });
  store.activity.length = Math.min(store.activity.length, 50);
  saveStore();
  renderAll();
  toast(status ? `${id} → ${VSTATUS[status].label} (simulated, saved in this browser)` : `Note added to ${id}`);
}

// ---------- routing + rendering ----------
const VIEWS = ['overview', 'map', 'risk', 'project', 'queue', 'about'];
const go = id => { location.hash = `#project/${encodeURIComponent(id)}`; };
function route() {
  const [v, id] = location.hash.slice(1).split('/');
  state.view = VIEWS.includes(v) ? v : 'overview';
  if (state.view === 'project' && id) state.selectedId = decodeURIComponent(id);
  $$('.view').forEach(s => { s.hidden = s.id !== `view-${state.view}`; });
  $$('.rail a[data-view]').forEach(a => {
    const on = a.dataset.view === state.view;
    a.classList.toggle('active', on);
    on ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current');
  });
  $('.rail a[data-view="project"]').href = state.selectedId ? `#project/${state.selectedId}` : '#project';
  const p = state.view === 'project' && byId(state.selectedId);
  document.title = `${p ? p.id : $(`.rail a[data-view="${state.view}"] .lbl`).textContent} · Bantay Proyekto (Demo)`;
  renderAll();
  window.scrollTo(0, 0);
}
function renderFilterChip() {
  const chip = $('#filter-chip');
  chip.hidden = !filtersActive();
  chip.innerHTML = `Filtered: ${filtered().length} of ${PROJECTS.length} projects <button data-action="reset-filters">Clear</button>`;
}
function renderAll() {
  renderFilterChip();
  if (state.view === 'overview') { renderOverview(); renderMap('mini', 'mini-map'); }
  if (state.view === 'map') { renderMapList(); renderMap('main', 'main-map'); }
  if (state.view === 'risk') renderTable();
  if (state.view === 'project') renderDetail();
  if (state.view === 'queue') renderQueue();
}
function renderThresholdForm() {
  const f = $('#threshold-form'), t = state.thresholds;
  f.high.value = t.high;
  f.med.value = t.med;
  $('#threshold-note').textContent = `Current bands: High ${t.high}–100 · Medium ${t.med}–${t.high - 1} · Low 0–${t.med - 1}.`;
}

// ---------- theme ----------
const THEME_KEY = 'bp-theme';
const savedTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } };
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = $('#theme-toggle'), dark = theme === 'dark';
  btn.setAttribute('aria-pressed', dark);
  btn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
  btn.firstElementChild.textContent = dark ? 'light_mode' : 'dark_mode';
  for (const m of Object.values(maps)) m.tiles?.setUrl(tileUrl());
}
// Follow the system setting until the viewer picks a theme with the button.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { if (!savedTheme()) applyTheme(e.matches ? 'dark' : 'light'); });
$('#theme-toggle').addEventListener('click', () => {
  const next = isDark() ? 'light' : 'dark';
  try { localStorage.setItem(THEME_KEY, next); } catch { /* storage blocked: applies for this visit only */ }
  applyTheme(next);
});

// ---------- events ----------
document.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.f) {
    state.filters[el.dataset.f] = el.value;
    if (el.dataset.f === 'province') state.filters.municipality = '';
    state.page = 0;
    syncFilterInputs(el);
    renderAll();
  } else if (el.dataset.swipe !== undefined) {
    $('#ev-swipe').style.setProperty('--pos', el.value + '%');
  }
});
document.addEventListener('change', e => {
  const band = e.target.dataset.band;
  if (band) {
    e.target.checked ? state.filters.hidden.delete(band) : state.filters.hidden.add(band);
    state.page = 0;
    syncFilterInputs();
    renderAll();
  }
  if (e.target.id === 'show-verified') { state.showVerified = e.target.checked; renderQueue(); }
});
document.addEventListener('click', e => {
  const t = e.target.closest('[data-goto],[data-focus],[data-sort],[data-page],[data-verify],[data-ev],[data-action]');
  if (!t) return;
  const d = t.dataset;
  if (d.verify !== undefined) openVerify(d.verify, d.status);
  else if (d.goto) go(d.goto);
  else if (d.focus) focusProject(d.focus);
  else if (d.sort) {
    state.sort = { key: d.sort, dir: state.sort.key === d.sort && state.sort.dir === 'desc' ? 'asc' : 'desc' };
    renderTable();
  } else if (d.page) { state.page += +d.page; renderTable(); }
  else if (d.ev) { state.evMode = d.ev; renderDetail(); }
  else if (d.action === 'reset-filters') resetFilters();
  else if (d.action === 'export') exportCSV();
  else if (d.action === 'reset-demo' && confirm('Reset all simulated verification changes, notes, activity and thresholds stored in this browser?')) {
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    location.reload();
  }
});
$('#verify-form').addEventListener('submit', e => {
  if (e.submitter?.value !== 'save' || !pendingVerify) return;
  const f = e.target;
  applyVerification(pendingVerify.id, pendingVerify.status, f.date.value, f.by.value.trim() || 'Demo inspector', f.note.value.trim());
  pendingVerify = null;
});
$('#threshold-form').addEventListener('submit', e => {
  e.preventDefault();
  const high = Math.round(+e.target.high.value), med = Math.round(+e.target.med.value);
  if (!(med >= 1 && high > med && high <= 100)) return toast('Thresholds must satisfy 1 ≤ medium < high ≤ 100.');
  state.thresholds = store.thresholds = { high, med };
  saveStore();
  buildFilters();
  renderThresholdForm();
  renderLegend();
  toast(`Risk thresholds updated: High ≥ ${high}, Medium ≥ ${med}.`);
});
window.addEventListener('hashchange', route);

applyTheme(document.documentElement.dataset.theme);
buildFilters();
renderLegend();
renderThresholdForm();
route();
