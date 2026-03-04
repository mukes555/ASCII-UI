import { Component } from './Component.js';

export class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state.activeTab = 0;
    this.width = this.props.width || this.width || 40;
    this.height = this.props.height || this.height || 10;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { fg, bg } = this.getColors(renderer);
    const fillBg = this.props.bg || theme.card?.bg || theme.surface?.bg || bg;
    let bfg = theme.border?.fg || fg;
    const mutedFg = theme.muted?.fg || fg;
    const accentFg = theme.ring?.fg || theme.focused?.bg || fg;
    const { x, y } = this.absPosition;
    const tabs = this.props.tabs || [];

    const borderStyle = this.props.borderStyle || theme.borders?.panel || 'single';
    if (this.width > 2 && this.height > 2) {
      renderer.rect(x + 1, y + 1, this.width - 2, this.height - 2, ' ', fg, fillBg);
    }
    renderer.box(x, y, this.width, this.height, borderStyle, bfg, fillBg);

    // Tab headers
    const headerY = y + 1;
    let cx = x + 1;
    for (let i = 0; i < tabs.length; i++) {
      const active = i === this.state.activeTab;
      const label = String(tabs[i].label ?? '');
      const text = ` ${label} `;
      const ofg = active ? accentFg : mutedFg;
      const obg = active ? (theme.accent?.bg || fillBg) : fillBg;
      renderer.text(cx, headerY, text, ofg, obg);
      cx += text.length + 1;
    }

    // Separator line
    if (this.state.focused) bfg = theme.ring?.fg || bfg;
    renderer.text(x + 1, y + 2, '-'.repeat(Math.max(0, this.width - 2)), bfg, fillBg);

    // Content area
    const contentY = y + 3;
    const contentW = this.width;
    const contentH = Math.max(0, this.height - 4);

    const activeContent = tabs[this.state.activeTab]?.content;
    if (activeContent) {
      const lines = String(activeContent).split('\n');
      for (let i = 0; i < Math.min(lines.length, contentH); i++) {
        renderer.text(x + 2, contentY + i, lines[i].slice(0, contentW - 4), theme.muted?.fg || fg, fillBg);
      }
    }
  }

  onClick(e, gx, gy) {
    const { x, y } = this.absPosition;
    if (gy !== y + 1) return;
    let cx = x + 1;
    const tabs = this.props.tabs || [];
    for (let i = 0; i < tabs.length; i++) {
      const label = String(tabs[i].label ?? '');
      const text = ` ${label} `;
      if (gx >= cx && gx < cx + text.length) {
        this.state.activeTab = i;
        return;
      }
      cx += text.length + 1;
    }
  }
}
