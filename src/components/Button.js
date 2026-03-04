import { Component } from './Component.js';

export class Button extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.state.pressedUntil = 0;
    const label = this.props.label || 'Button';
    this.width = this.props.width || this.width || (label.length + 4);
    this.height = this.props.height || this.height || 3;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const base = this.getColors(renderer);
    let fg = base.fg;
    let bg = base.bg;
    let bfg = theme.border?.fg ?? fg;
    const { x, y } = this.absPosition;
    const label = this.props.label || 'Button';
    const variant = this.props.variant || 'default';
    const now = performance.now();
    const pressed = now < (this.state.pressedUntil || 0);

    const surfaceBg = theme.surface?.bg ?? bg;
    const surfaceFg = theme.surface?.fg ?? fg;
    const mutedFg = theme.muted?.fg ?? theme.placeholder?.fg ?? fg;
    const mutedBg = theme.muted?.bg ?? surfaceBg;
    const accentBg = theme.accent?.bg ?? mutedBg;
    const accentFg = theme.accent?.fg ?? fg;
    const screenBg = theme.screen?.bg ?? bg;

    let drawBorder = true;
    let borderStyle = this.props.borderStyle || theme.borders?.control || 'single';
    let renderMode = 'box'; // box | ghost | link

    if (variant === 'primary') {
      fg = theme.focused?.fg ?? fg;
      bg = theme.focused?.bg ?? bg;
      bfg = bg;
    } else if (variant === 'destructive') {
      fg = theme.destructive?.fg ?? fg;
      bg = theme.destructive?.bg ?? theme.error ?? bg;
      bfg = bg;
    } else if (variant === 'outline') {
      bg = screenBg;
      fg = surfaceFg;
      bfg = theme.border?.fg ?? fg;
      if (this.state.hovered) {
        bg = accentBg;
        fg = accentFg;
      }
    } else if (variant === 'ghost') {
      renderMode = 'ghost';
      drawBorder = false;
      this.height = 3;
    } else if (variant === 'link' || variant === 'active') {
      renderMode = 'link';
      drawBorder = false;
      this.height = 1;
    } else {
      // default
      bg = this.props.bg ?? surfaceBg;
      fg = this.props.fg ?? surfaceFg;
      if (this.state.hovered) {
        bg = accentBg;
        fg = accentFg;
      }
    }

    if (pressed) {
      const pfg = fg;
      fg = bg;
      bg = pfg;
    }

    if (this.state.focused && drawBorder) {
      bfg = theme.ring?.fg ?? bfg;
    }

    if (renderMode === 'ghost') {
      // Ghost: looks like text but has hover bg highlight
      const padLabel = ` ${label} `;
      const ghostBg = this.state.hovered ? accentBg : screenBg;
      const ghostFg = this.state.hovered ? accentFg : surfaceFg;
      this.width = padLabel.length + 2;
      this.height = 3;
      // Draw a faint dotted border to show it is clickable
      const dotH = '.'.repeat(padLabel.length);
      renderer.text(x + 1, y, dotH, mutedFg, screenBg);
      renderer.text(x, y + 1, ' ', mutedFg, screenBg);
      renderer.text(x + 1, y + 1, padLabel, ghostFg, ghostBg);
      renderer.text(x + 1 + padLabel.length, y + 1, ' ', mutedFg, screenBg);
      renderer.text(x + 1, y + 2, dotH, mutedFg, screenBg);
    } else if (renderMode === 'link') {
      // Link: underlined text style
      const linkFg = this.state.hovered
        ? (theme.ring?.fg ?? theme.focused?.bg ?? fg)
        : (this.props.active || variant === 'active')
          ? (theme.ring?.fg ?? theme.selected?.fg ?? fg)
          : mutedFg;
      const text = ` ${label} `;
      const underline = ' ' + '_'.repeat(label.length) + ' ';
      this.width = text.length;
      this.height = 2;
      renderer.text(x, y, text, linkFg, screenBg);
      renderer.text(x, y + 1, underline, linkFg, screenBg);
    } else if (drawBorder) {
      if (this.width > 2 && this.height > 2) {
        renderer.rect(x + 1, y + 1, this.width - 2, this.height - 2, ' ', fg, bg);
      }
      renderer.box(x, y, this.width, this.height, borderStyle, bfg, bg);
      const tx = x + Math.max(1, Math.floor((this.width - label.length) / 2));
      renderer.text(tx, y + 1, label, fg, bg);
    }
  }

  onClick() {
    this.state.pressedUntil = performance.now() + 120;
    if (this.props.onClick) this.props.onClick();
    if (this.props.on && this.props.on.click) this.props.on.click();
    if (this.on && this.on.click) this.on.click();
  }

  onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.onClick();
    }
  }
}
