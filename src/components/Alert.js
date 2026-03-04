import { Component } from './Component.js';

export class Alert extends Component {
  constructor(props) {
    super(props);
    this.width = this.props.width || this.width || 50;
    this.height = this.props.height || this.height || 3;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { x, y } = this.absPosition;
    const variant = this.props.variant || 'default';
    const fillBg = theme.card?.bg || theme.surface?.bg || theme.normal?.bg;
    const fg = theme.normal?.fg;

    let bfg = theme.border?.fg || fg;
    let iconFg = theme.muted?.fg || fg;

    if (variant === 'destructive') {
      bfg = theme.error || '#EF4444';
      iconFg = theme.error || '#EF4444';
    }

    if (this.width > 2 && this.height > 2) {
      renderer.rect(x + 1, y + 1, this.width - 2, this.height - 2, ' ', fg, fillBg);
    }
    renderer.box(x, y, this.width, this.height, 'single', bfg, fillBg);
    const icon = variant === 'destructive' ? '!' : '*';
    const msg = String(this.props.text ?? '');
    renderer.text(x + 2, y + 1, `${icon} ${msg}`.slice(0, this.width - 4), variant === 'destructive' ? iconFg : fg, fillBg);
  }
}
