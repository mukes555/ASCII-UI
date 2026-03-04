import { Component } from './Component.js';

export class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.zIndex = props.zIndex || 1500;
    this.visible = props.visible !== false;
    this.width = this.props.width || this.width || 24;
    this.height = this.props.height || this.height || 3;
  }

  get target() {
    return this.props.target || null;
  }

  onRender(renderer) {
    if (!this.visible) return;
    const target = this.target;
    if (!target || !target.state || !target.state.hovered) return;

    const theme = renderer.theme;
    const fg = theme.normal?.fg;
    const bg = theme.surface?.bg || theme.normal?.bg;
    const bfg = theme.border?.fg || fg;
    const pos = target._lastAbsPosition || target.absPosition;
    const { x: tx, y: ty } = pos;

    const text = String(this.props.text ?? '');
    const w = Math.max(10, Math.min(this.props.width || this.width, renderer.cols - 2));
    const lines = wrap(text, w - 2).slice(0, Math.max(1, this.height - 2));
    const h = Math.max(3, lines.length + 2);

    let x = tx;
    let y = ty - h - 1;
    if (y < 0) y = ty + (target.height || 1) + 1;
    if (x + w > renderer.cols - 1) x = Math.max(0, renderer.cols - 1 - w);

    renderer.rect(x + 1, y + 1, w - 2, h - 2, ' ', fg, bg);
    renderer.box(x, y, w, h, theme.borders?.panel || 'rounded', bfg, bg);
    for (let i = 0; i < Math.min(lines.length, h - 2); i++) {
      renderer.text(x + 1, y + 1 + i, lines[i].padEnd(w - 2, ' '), theme.muted?.fg || fg, bg);
    }
  }
}

function wrap(text, width) {
  const out = [];
  const words = String(text).split(/\s+/).filter(Boolean);
  let line = '';
  for (const w of words) {
    if (!line) {
      line = w;
      continue;
    }
    if ((line.length + 1 + w.length) <= width) {
      line += ' ' + w;
    } else {
      out.push(line.slice(0, width));
      line = w;
    }
  }
  if (line) out.push(line.slice(0, width));
  if (!out.length) out.push('');
  return out;
}
