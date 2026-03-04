import { Component } from './Component.js';

export class Modal extends Component {
  constructor(props) {
    super(props);
    this.visible = props.visible || false;
    this.zIndex = props.zIndex || 1000;
    this.props.focusable = true;
    this.state.selectedButton = 0;
    this.x = props.x || 0;
    this.y = props.y || 0;
    this.width = props.width || 10000;
    this.height = props.height || 10000;
  }

  show() { this.visible = true; }
  hide() { this.visible = false; }

  onRender(renderer) {
    if (!this.visible) return;

    const theme = renderer.theme;
    const fg = theme.normal?.fg || '#000';
    const bg = theme.card?.bg || theme.surface?.bg || theme.normal?.bg || '#fff';
    const bfg = theme.modal?.border?.fg || theme.border?.fg || fg;
    const mutedFg = theme.muted?.fg || fg;
    const borderStyle = theme.borders?.modal || 'single';

    const title = this.props.title || 'Dialog';
    const content = this.props.content || '';
    const buttons = this.props.buttons || ['OK'];
    const contentLines = String(content).split('\n');
    const maxLineLen = contentLines.reduce((m, s) => Math.max(m, s.length), 0);

    const boxW = this.props.boxWidth || Math.min(renderer.cols - 4, Math.max(30, Math.max(title.length + 10, maxLineLen + 6)));
    const boxH = this.props.boxHeight || Math.min(renderer.rows - 4, Math.max(8, contentLines.length + 7));

    const cx = Math.floor((renderer.cols - boxW) / 2);
    const cy = Math.floor((renderer.rows - boxH) / 2);

    // Dimmed backdrop
    renderer.rect(0, 0, renderer.cols, renderer.rows, ' ', fg, theme.modal?.backdrop?.bg || bg);

    // Dialog box
    if (boxW > 2 && boxH > 2) renderer.rect(cx + 1, cy + 1, boxW - 2, boxH - 2, ' ', fg, bg);
    renderer.box(cx, cy, boxW, boxH, borderStyle, bfg, bg);

    // Title (left-aligned)
    renderer.text(cx + 2, cy + 1, title, theme.title?.fg || fg, bg);

    // Close button [x] top-right
    renderer.text(cx + boxW - 4, cy, '[x]', mutedFg, bg);

    // Content (muted)
    const innerW = boxW - 4;
    const maxContentLines = Math.max(0, boxH - 6);
    for (let i = 0; i < Math.min(maxContentLines, contentLines.length); i++) {
      const line = contentLines[i].slice(0, innerW);
      renderer.text(cx + 2, cy + 3 + i, line, mutedFg, bg);
    }

    // Separator above buttons
    renderer.text(cx + 1, cy + boxH - 3, '-'.repeat(Math.max(0, boxW - 2)), bfg, bg);

    // Buttons (right-aligned)
    let bx = cx + boxW - 2;
    for (let i = buttons.length - 1; i >= 0; i--) {
      const label = `[ ${buttons[i]} ]`;
      bx -= label.length;
      const btnFg = i === this.state.selectedButton ? (theme.selected?.fg || fg) : fg;
      const btnBg = i === this.state.selectedButton ? (theme.selected?.bg || bg) : bg;
      renderer.text(bx, cy + boxH - 2, label, btnFg, btnBg);
      bx -= 1;
    }
  }

  onClick(e, gx, gy, renderer) {
    if (!this.visible || !renderer) return;

    const title = this.props.title || 'Dialog';
    const content = this.props.content || '';
    const buttons = this.props.buttons || ['OK'];
    const contentLines = String(content).split('\n');
    const maxLineLen = contentLines.reduce((m, s) => Math.max(m, s.length), 0);
    const boxW = this.props.boxWidth || Math.min(renderer.cols - 4, Math.max(30, Math.max(title.length + 10, maxLineLen + 6)));
    const boxH = this.props.boxHeight || Math.min(renderer.rows - 4, Math.max(8, contentLines.length + 7));
    const cx = Math.floor((renderer.cols - boxW) / 2);
    const cy = Math.floor((renderer.rows - boxH) / 2);

    // Close button check
    if (gy === cy && gx >= cx + boxW - 4 && gx < cx + boxW - 1) {
      this.hide();
      return;
    }

    // Button row check
    const by = cy + boxH - 2;
    if (gy !== by) return;

    let bx = cx + boxW - 2;
    for (let i = buttons.length - 1; i >= 0; i--) {
      const label = `[ ${buttons[i]} ]`;
      bx -= label.length;
      if (gx >= bx && gx < bx + label.length) {
        this.state.selectedButton = i;
        if (this.on && this.on.action) this.on.action(buttons[i]);
        if (this.props.on && this.props.on.action) this.props.on.action(buttons[i]);
        if (buttons[i].toLowerCase() === 'cancel' || buttons[i].toLowerCase() === 'ok' || buttons[i].toLowerCase() === 'close') this.hide();
        return;
      }
      bx -= 1;
    }
  }

  onKeyDown(e) {
    if (!this.visible) return;
    const buttons = this.props.buttons || ['OK'];
    if (e.key === 'Escape') { this.hide(); return; }
    if (e.key === 'ArrowLeft') { this.state.selectedButton = Math.max(0, this.state.selectedButton - 1); return; }
    if (e.key === 'ArrowRight') { this.state.selectedButton = Math.min(buttons.length - 1, this.state.selectedButton + 1); return; }
    if (e.key === 'Enter' || e.key === ' ') {
      const label = buttons[this.state.selectedButton];
      if (this.on && this.on.action) this.on.action(label);
      if (this.props.on && this.props.on.action) this.props.on.action(label);
      if (label.toLowerCase() === 'cancel' || label.toLowerCase() === 'ok' || label.toLowerCase() === 'close') this.hide();
    }
  }
}
