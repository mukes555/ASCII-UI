import { Component } from './Component.js';

export class Skeleton extends Component {
  constructor(props) {
    super(props);
    this.state.t = 0;
    this.width = this.props.width || this.width || 20;
    this.height = this.props.height || this.height || 1;
  }

  onTick(dt) {
    this.state.t += dt;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { x, y } = this.absPosition;
    const w = this.props.width || this.width;
    const h = this.props.height || this.height;
    const bg = theme.surface?.bg || theme.normal?.bg;
    const baseFg = theme.muted?.fg || theme.border?.fg || theme.normal?.fg;
    const hiFg = theme.ring?.fg || theme.border?.fg || baseFg;

    const baseChar = this.props.char || '.';
    const hiChar = this.props.highlightChar || 'o';

    const speed = Number(this.props.speedMs ?? 90);
    const pos = Math.floor((this.state.t / speed) % Math.max(1, w + 6)) - 3;

    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const d = Math.abs(xx - pos);
        const hi = d <= 1;
        renderer.set(x + xx, y + yy, hi ? hiChar : baseChar, hi ? hiFg : baseFg, bg);
      }
    }
  }
}
