import { Component } from './Component.js';

export class Meter extends Component {
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
    const { x, y } = this.absPosition;
    const width = this.props.width || this.width;
    let value = Math.max(0, Math.min(100, Number(this.props.value ?? 0)));
    if (this.props.animate) {
      value = 50 + 50 * Math.sin(this.state.t / 500);
    }
    const filled = Math.round((width - 2) * (value / 100));
    const bar = '='.repeat(filled) + ' '.repeat(Math.max(0, (width - 2) - filled));
    renderer.text(x, y, '[' + bar + ']', fg, bg);
  }
}
