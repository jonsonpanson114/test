// Example of the "pattern catalogue" generator (from the IDO work-booth deck). Adapt the geometry to your product.
// Idea: describe each variant as data -> draw front view + plan view as inline SVG -> fill cards. Never hand-draw 9 variants.
//
// cfg = { dtype:'swing'|'slide', side:'glass'|'panel', bd:'glass'|'panel', eq:'waist'|'high',
//         roof, wall, door  (CSS colours),  gl, gr, gd (optional glass colours) }
const GLASS = '#BFE0F0';

function front(c) {                       // viewBox 0 0 400 340
  const roof = c.roof || '#fff', wall = c.wall || '#fff', door = c.door || '#fff';
  let s = '<g stroke="#23292B" stroke-width="4" stroke-linejoin="round">';
  s += `<rect x="26" y="34" width="348" height="22" fill="${roof}"/><rect x="36" y="56" width="328" height="278" fill="${wall}"/>`;
  [[52, c.gl || GLASS], [262, c.gr || GLASS]].forEach(([x, col]) => {
    s += c.side === 'glass'
      ? `<rect x="${x}" y="78" width="88" height="148" fill="${col}"/>`            // half-height glass
      : `<rect x="${x}" y="78" width="88" height="248" fill="${wall}" stroke-width="2"/>`; // full panel
  });
  s += `<rect x="148" y="68" width="104" height="266" fill="${door}"/><rect x="172" y="92" width="56" height="172" fill="${c.gd || GLASS}"/>`;
  if (c.dtype === 'slide') s += '<path d="M148 62h200" stroke-width="3"/>';        // hanging rail
  return s + '</g>';
}

function plan(c) {                         // viewBox 0 0 300 335; faces C(top) B(left) D(right) A(bottom, door in the middle)
  const seg = (x, y, w, h, t) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${t === 'glass' ? '#7EC3E6' : (c.wall || '#fff')}" stroke="#23292B" stroke-width="3"/>`;
  let s = '<rect x="34" y="34" width="232" height="232" fill="#F7F4EA"/>';
  s += seg(20, 20, 260, 14, 'panel') + seg(20, 34, 14, 232, c.bd) + seg(266, 34, 14, 232, c.bd);
  s += seg(20, 266, 84, 14, c.side) + seg(196, 266, 84, 14, c.side);
  return s;                                // add equipment / door swing as needed
}

// usage: const d = document.createElement('div'); d.innerHTML = `<svg viewBox="0 0 400 340">${front(cfg)}</svg>` ...
// Constraint rules (e.g. "back face and ceiling are always full panel", "hanging door is inside-mount only") belong in the data
// you iterate over, taken from the spec sheet - do not generate combinations the product cannot do.
