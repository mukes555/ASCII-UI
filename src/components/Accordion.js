import { Component } from './Component.js';

export class Accordion extends Component {
  constructor(props) {
    super(props);
    this.props.focusable = true;
    this.state.openIndex = props.openIndex ?? 0;
    this.width = this.props.width || this.width || 50;
    this.height = this.props.height || this.height || 8;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const fg = theme.normal?.fg;
    const bg = theme.normal?.bg;
    const bfg = theme.border?.fg || fg;
    const mutedFg = theme.muted?.fg || fg;
    const { x, y } = this.absPosition;
    const innerW = Math.max(0, this.width - 2);

    renderer.box(x, y, this.width, this.height, theme.borders?.panel || 'single', bfg, bg);

    const items = this.props.items || [];
    let cy = y + 1;
    for (let i = 0; i < items.length; i++) {
      if (cy >= y + this.height - 1) break;
      const header = String(items[i].header ?? `Section ${i + 1}`);
      const open = i === this.state.openIndex;
      const marker = open ? '[v]' : '[>]';

      renderer.text(x + 1, cy, `${marker} ${header}`.slice(0, innerW), fg, bg);
      cy += 1;

      if (open) {
        const lines = String(items[i].content ?? '').split('\n');
        for (let li = 0; li < lines.length; li++) {
          if (cy >= y + this.height - 1) break;
          renderer.text(x + 5, cy, lines[li].slice(0, Math.max(0, innerW - 4)), mutedFg, bg);
          cy += 1;
        }
      }

      // Separator between items
      if (i < items.length - 1 && cy < y + this.height - 1) {
        renderer.text(x + 1, cy, '-'.repeat(innerW), bfg, bg);
        cy += 1;
      }
    }
  }

  onClick(e, gx, gy) {
    const { x, y } = this.absPosition;
    if (gx < x + 1 || gx >= x + this.width - 1) return;
    if (gy <= y || gy >= y + this.height - 1) return;
    const row = gy - (y + 1);
    const items = this.props.items || [];
    let cy = 0;
    for (let i = 0; i < items.length; i++) {
      if (cy === row) {
        this.state.openIndex = this.state.openIndex === i ? -1 : i;
        return;
      }
      cy += 1;
      if (i === this.state.openIndex) {
        const lines = String(items[i].content ?? '').split('\n');
        cy += lines.length;
      }
      // separator
      if (i < items.length - 1) cy += 1;
    }
  }
}
