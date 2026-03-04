import { Component } from './Component.js';

export class Divider extends Component {
  constructor(props) {
    super(props);
    this.height = 1;
    this.width = this.props.length || this.props.width || this.width || 10;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const fg = theme.border?.fg || theme.muted?.fg || theme.normal?.fg;
    const bg = theme.normal?.bg;
    const { x, y } = this.absPosition;
    const style = this.props.style || 'solid';
    const len = this.props.length || this.width;

    if (style === 'v' || style === 'vertical') {
      const h = this.props.height || this.height || len;
      for (let i = 0; i < h; i++) renderer.text(x, y + i, '|', fg, bg);
      return;
    }

    const ch = style === 'dashed' ? '.' : '-';
    renderer.text(x, y, ch.repeat(Math.max(0, len)), fg, bg);
  }
}
