import { Component } from './Component.js';

export class Select extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.state.open = false;
    this.state.selectedIndex = props.selectedIndex || 0;
    this.width = this.props.width || this.width || 20;
    this.height = 3;
  }

  get options() {
    return this.props.options || [];
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { fg, bg } = this.getColors(renderer);
    const fillBg = this.props.bg || theme.surface?.bg || bg;
    const fillFg = this.props.fg || theme.surface?.fg || fg;
    let bfg = theme.border?.fg || fg;
    const accentBg = theme.accent?.bg || theme.muted?.bg || bg;
    const accentFg = theme.accent?.fg || fg;
    const { x, y } = this.absPosition;

    const label = String(this.options[this.state.selectedIndex]?.label ?? this.props.placeholder ?? '');
    const innerWidth = Math.max(0, this.width - 4);
    const shown = label.length > innerWidth ? label.slice(0, innerWidth) : label;

    const style = this.props.borderStyle || theme.borders?.control || 'single';
    if (this.state.focused) bfg = theme.ring?.fg || bfg;

    renderer.rect(x + 1, y + 1, Math.max(0, this.width - 2), 1, ' ', fillFg, fillBg);
    renderer.box(x, y, this.width, 3, style, bfg, fillBg);
    renderer.text(x + 1, y + 1, shown.padEnd(innerWidth, ' '), fg, fillBg);
    renderer.text(x + this.width - 2, y + 1, 'v', theme.muted?.fg || fg, fillBg);

    if (!this.state.open) {
      this.height = 3;
      return;
    }

    const maxVisible = Math.min(8, this.options.length);
    const listH = maxVisible + 2;
    this.height = 3 + listH;

    const ly = y + 3;
    if (this.width > 2 && listH > 2) {
      renderer.rect(x + 1, ly + 1, this.width - 2, listH - 2, ' ', fillFg, fillBg);
    }
    renderer.box(x, ly, this.width, listH, style, bfg, fillBg);
    for (let i = 0; i < maxVisible; i++) {
      const idx = i;
      const opt = String(this.options[idx]?.label ?? '');
      const sel = idx === this.state.selectedIndex;
      const ofg = sel ? accentFg : fg;
      const obg = sel ? accentBg : fillBg;
      renderer.rect(x + 1, ly + 1 + i, this.width - 2, 1, ' ', ofg, obg);
      renderer.text(x + 2, ly + 1 + i, opt.slice(0, this.width - 4), ofg, obg);
    }
  }

  onClick(e, gx, gy) {
    const { x, y } = this.absPosition;
    const headerInside = gx >= x && gx < x + this.width && gy >= y && gy < y + 3;
    if (headerInside) {
      this.state.open = !this.state.open;
      if (!this.state.open) this.height = 3;
      else {
        const maxVisible = Math.min(8, this.options.length);
        this.height = 3 + maxVisible + 2;
      }
      return;
    }

    if (!this.state.open) return;

    const maxVisible = Math.min(8, this.options.length);
    const ly = y + 3;
    const insideList = gx >= x && gx < x + this.width && gy >= ly + 1 && gy < ly + 1 + maxVisible;
    if (!insideList) { this.state.open = false; this.height = 3; return; }

    const idx = gy - (ly + 1);
    this.select(idx);
    this.state.open = false;
    this.height = 3;
  }

  onKeyDown(e) {
    if (!this.options.length) return;
    if (e.key === 'Enter' || e.key === ' ') {
      this.state.open = !this.state.open;
      if (!this.state.open) this.height = 3;
      else {
        const maxVisible = Math.min(8, this.options.length);
        this.height = 3 + maxVisible + 2;
      }
      return;
    }
    if (e.key === 'Escape') { this.state.open = false; this.height = 3; return; }
    if (e.key === 'ArrowDown') this.select(Math.min(this.options.length - 1, this.state.selectedIndex + 1));
    else if (e.key === 'ArrowUp') this.select(Math.max(0, this.state.selectedIndex - 1));
  }

  select(idx) {
    this.state.selectedIndex = idx;
    const item = this.options[idx];
    if (this.props.on && this.props.on.change) this.props.on.change(item);
    if (this.on && this.on.change) this.on.change(item);
  }
}
