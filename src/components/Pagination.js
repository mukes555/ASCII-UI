import { Component } from './Component.js';

export class Pagination extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.state.page = props.page || 1;
    this.width = this.props.width || this.width || 40;
    this.height = 1;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const fg = theme.normal?.fg;
    const bg = theme.normal?.bg;
    const selFg = theme.selected?.fg || fg;
    const selBg = theme.selected?.bg || bg;
    const { x, y } = this.absPosition;

    const total = this.props.total || 3;
    const parts = [];
    parts.push({ label: '<', action: () => this.setPage(Math.max(1, this.state.page - 1)) });
    for (let p = 1; p <= total; p++) {
      parts.push({ label: String(p), page: p, action: () => this.setPage(p) });
    }
    parts.push({ label: '>', action: () => this.setPage(Math.min(total, this.state.page + 1)) });

    let cx = x;
    for (const part of parts) {
      const active = part.page === this.state.page;
      const text = `[${part.label}]`;
      renderer.text(cx, y, text, active ? selFg : fg, active ? selBg : bg);
      cx += text.length + 1;
    }
  }

  onClick(e, gx, gy) {
    const { x, y } = this.absPosition;
    if (gy !== y) return;
    const total = this.props.total || 3;

    const parts = [];
    parts.push({ label: '<', action: () => this.setPage(Math.max(1, this.state.page - 1)) });
    for (let p = 1; p <= total; p++) parts.push({ label: String(p), page: p, action: () => this.setPage(p) });
    parts.push({ label: '>', action: () => this.setPage(Math.min(total, this.state.page + 1)) });

    let cx = x;
    for (const part of parts) {
      const text = `[${part.label}]`;
      if (gx >= cx && gx < cx + text.length) {
        part.action();
        return;
      }
      cx += text.length + 1;
    }
  }

  onKeyDown(e) {
    const total = this.props.total || 3;
    if (e.key === 'ArrowLeft') this.setPage(Math.max(1, this.state.page - 1));
    if (e.key === 'ArrowRight') this.setPage(Math.min(total, this.state.page + 1));
  }

  setPage(p) {
    this.state.page = p;
    if (this.props.on && this.props.on.change) this.props.on.change(p);
    if (this.on && this.on.change) this.on.change(p);
  }
}

