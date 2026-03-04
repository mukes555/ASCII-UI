import { Component } from './Component.js';

export class Breadcrumb extends Component {
  constructor(props) {
    super(props);
    this.height = 1;
    this.width = this.props.width || this.width || 40;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const fg = theme.normal?.fg;
    const bg = theme.normal?.bg;
    const mutedFg = theme.muted?.fg || fg;
    const { x, y } = this.absPosition;
    const items = this.props.items || [];

    let cx = x;
    for (let i = 0; i < items.length; i++) {
      const label = String(items[i].label ?? items[i]);
      const isLast = i === items.length - 1;
      const itemFg = isLast ? fg : mutedFg;
      renderer.text(cx, y, label, itemFg, bg);
      cx += label.length;
      if (!isLast) {
        renderer.text(cx, y, ' / ', mutedFg, bg);
        cx += 3;
      }
      if (cx >= x + this.width) break;
    }
  }
}
