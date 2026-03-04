import { Component } from './Component.js';

export class StatusBar extends Component {
  constructor(props) {
    super(props);
    this.height = 1;
    this.width = this.props.width || this.width || 80;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const fg = theme.statusBar?.fg || theme.muted?.fg || theme.normal?.fg;
    const bg = theme.statusBar?.bg || theme.surface?.bg || theme.normal?.bg;
    const sepFg = theme.border?.fg || fg;
    const { x, y } = this.absPosition;
    const width = this.width;

    renderer.rect(x, y, width, 1, ' ', fg, bg);

    const segments = this.props.segments || [];
    let cx = x;
    for (let i = 0; i < segments.length; i++) {
      if (i > 0) {
        renderer.text(cx, y, '|', sepFg, bg);
        cx += 1;
      }
      const seg = segments[i];
      const text = String(seg.text ?? '');
      const segW = seg.width || text.length;
      let rendered = text.slice(0, segW);
      if (seg.align === 'right') rendered = rendered.padStart(segW, ' ');
      else rendered = rendered.padEnd(segW, ' ');
      renderer.text(cx, y, rendered, fg, bg);
      cx += segW;
    }
  }
}
