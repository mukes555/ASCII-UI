import { Component } from './Component.js';

export class Spinner extends Component {
  constructor(props) {
    super(props);
    this.state.t = 0;
    this.width = 1;
    this.height = 1;
  }

  onTick(dt) {
    this.state.t += dt;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const fg = theme.muted?.fg || theme.normal?.fg;
    const bg = theme.normal?.bg;
    const { x, y } = this.absPosition;
    const frames = this.props.frames || ['-', '\\', '|', '/'];
    const idx = Math.floor((this.state.t / (this.props.speedMs || 80)) % frames.length);
    renderer.text(x, y, frames[idx], fg, bg);
  }
}
