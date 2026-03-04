import { Component } from './Component.js';

export class Badge extends Component {
  constructor(props) {
    super(props);
    const text = String(this.props.text ?? '');
    this.width = this.props.width || this.width || (text.length + 4);
    this.height = 1;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { x, y } = this.absPosition;
    const text = String(this.props.text ?? '');
    const variant = this.props.variant || 'default';

    let fg, bg;
    if (variant === 'secondary') {
      fg = theme.muted?.fg ?? theme.normal?.fg;
      bg = theme.muted?.bg ?? theme.normal?.bg;
    } else if (variant === 'outline') {
      fg = theme.normal?.fg;
      bg = theme.screen?.bg ?? theme.normal?.bg;
    } else if (variant === 'destructive') {
      fg = theme.destructive?.fg ?? theme.normal?.fg;
      bg = theme.destructive?.bg ?? theme.error ?? theme.normal?.bg;
    } else {
      // default
      fg = theme.focused?.fg ?? theme.normal?.bg;
      bg = theme.focused?.bg ?? theme.normal?.fg;
    }

    const padded = ` ${text} `;
    renderer.text(x, y, padded, fg, bg);
    this.width = padded.length;
  }
}
