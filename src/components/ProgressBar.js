import { Component } from './Component.js';

export class ProgressBar extends Component {
  constructor(props) {
    super(props);
    this.width = this.props.width || this.width || 20;
    this.height = 1;
    this.state.t = 0;
  }

  onTick(dt) {
    if (this.props.animate) this.state.t += dt;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const fg = theme.normal?.fg;
    const bg = theme.normal?.bg;
    const filledFg = theme.ring?.fg || theme.focused?.bg || fg;
    const emptyFg = theme.muted?.fg || theme.border?.fg || fg;
    const { x, y } = this.absPosition;
    const width = this.props.width || this.width;
    const inner = Math.max(0, width - 2);

    const fillChar = '=';
    const emptyChar = '-';
    let bar = '';
    if (this.props.animate && this.props.indeterminate) {
      const block = Math.max(1, Math.min(6, Math.floor(inner / 6)));
      const pos = inner > 0 ? Math.floor((this.state.t / 60) % (inner + block)) - block : 0;
      for (let i = 0; i < inner; i++) {
        const inBlock = i >= pos && i < pos + block;
        bar += inBlock ? fillChar : emptyChar;
      }
    } else {
      const value = Math.max(0, Math.min(100, Number(this.props.value ?? 0)));
      const filled = Math.round(inner * (value / 100));
      bar = fillChar.repeat(filled) + emptyChar.repeat(Math.max(0, inner - filled));
    }

    // Render with different colors for filled and empty portions
    renderer.text(x, y, '[', emptyFg, bg);
    const value = Math.max(0, Math.min(100, Number(this.props.value ?? 0)));
    const filled = Math.round(inner * (value / 100));
    if (!this.props.indeterminate) {
      for (let i = 0; i < inner; i++) {
        const ch = i < filled ? fillChar : emptyChar;
        const color = i < filled ? filledFg : emptyFg;
        renderer.text(x + 1 + i, y, ch, color, bg);
      }
    } else {
      renderer.text(x + 1, y, bar, filledFg, bg);
    }
    renderer.text(x + 1 + inner, y, ']', emptyFg, bg);
  }
}
