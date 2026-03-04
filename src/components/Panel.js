import { Component } from './Component.js';

export class Panel extends Component {
  onRender(renderer) {
    const theme = renderer.theme;
    const { fg, bg } = this.getColors(renderer);
    const fillBg = this.props.bg || theme.card?.bg || theme.surface?.bg || bg;
    const fillFg = this.props.fg || theme.card?.fg || fg;
    const bfg = theme.border?.fg || fg;
    const { x, y } = this.absPosition;
    const borderStyle = this.props.borderStyle || theme.borders?.panel || 'single';

    if (borderStyle !== 'none') {
      if (this.width > 2 && this.height > 2) {
        renderer.rect(x + 1, y + 1, this.width - 2, this.height - 2, ' ', fillFg, fillBg);
      }
      renderer.box(x, y, this.width, this.height, borderStyle, bfg, fillBg);
    }

    let titleY = y;
    if (this.props.title) {
      const title = ` ${this.props.title} `;
      // Left-aligned title with small offset
      const tx = x + 2;
      renderer.text(tx, titleY, title, theme.title?.fg || fg, fillBg);
    }

    if (this.props.description) {
      const desc = String(this.props.description);
      const mutedFg = theme.muted?.fg || theme.placeholder?.fg || fg;
      renderer.text(x + 2, y + 1, desc.slice(0, Math.max(0, this.width - 4)), mutedFg, fillBg);
    }
  }
}
