import { Component } from './Component.js';

export class Link extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    const text = String(this.props.text ?? '');
    this.width = this.props.width || this.width || text.length;
    this.height = 1;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const normal = theme.normal || {};
    const muted = theme.muted || {};
    const { x, y } = this.absPosition;
    const text = String(this.props.text ?? '');
    const active = !!this.props.active;
    const accentFg = theme.ring?.fg ?? theme.focused?.bg ?? normal.fg;
    const isHighlighted = this.state.hovered || this.state.focused;

    let fg, bg;
    if (active) {
      fg = accentFg;
      bg = normal.bg;
    } else if (isHighlighted) {
      fg = normal.fg;
      bg = normal.bg;
    } else {
      fg = muted.fg ?? normal.fg;
      bg = normal.bg;
    }

    const out = text.slice(0, this.width);
    renderer.text(x, y, out, fg, bg);
  }

  onClick() {
    if (this.props.onClick) this.props.onClick();
    if (this.props.on && this.props.on.click) this.props.on.click();
    if (this.on && this.on.click) this.on.click();
  }

  onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') this.onClick();
  }
}
