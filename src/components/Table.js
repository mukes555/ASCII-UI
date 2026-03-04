import { Component } from './Component.js';

export class Table extends Component {
  constructor(props) {
    super(props);
    this.width = this.props.width || this.width || 60;
    this.height = this.props.height || this.height || 10;
  }

  onRender(renderer) {
    const theme = renderer.theme;
    const { fg, bg } = this.getColors(renderer);
    const bfg = theme.border?.fg || fg;
    const fillBg = this.props.bg || theme.card?.bg || theme.surface?.bg || bg;
    const { x, y } = this.absPosition;
    const columns = this.props.columns || [];
    const data = this.props.data || [];
    const maxRows = this.props.maxVisibleRows || 5;
    const borderStyle = this.props.borderStyle || theme.borders?.panel || 'single';

    if (this.width > 2 && this.height > 2) {
      renderer.rect(x + 1, y + 1, this.width - 2, this.height - 2, ' ', fg, fillBg);
    }
    renderer.box(x, y, this.width, this.height, borderStyle, bfg, fillBg);

    const innerX = x + 1;
    const innerY = y + 1;
    const innerW = Math.max(0, this.width - 2);
    const innerH = Math.max(0, this.height - 2);

    // Header with muted background
    const headerBg = theme.muted?.bg || fillBg;
    const headerFg = theme.title?.fg || fg;
    renderer.rect(innerX, innerY, innerW, 1, ' ', headerFg, headerBg);

    let cx = innerX;
    for (let i = 0; i < columns.length; i++) {
      const w = columns[i].width || Math.floor(innerW / Math.max(1, columns.length));
      const text = String(columns[i].header ?? '').slice(0, Math.max(0, w - 1));
      renderer.text(cx + 1, innerY, text, headerFg, headerBg);
      cx += w;
    }

    // Header separator
    if (innerH >= 2) {
      renderer.text(innerX, innerY + 1, '-'.repeat(innerW), bfg, fillBg);
    }

    // Data rows with alternating bg
    const rowsAvail = Math.max(0, innerH - 2);
    const rows = Math.min(maxRows, data.length, rowsAvail);
    for (let r = 0; r < rows; r++) {
      const rowY = innerY + 2 + r;
      const altBg = r % 2 === 0 ? fillBg : (theme.surface?.bg || fillBg);
      const rowFg = theme.muted?.fg || fg;
      renderer.rect(innerX, rowY, innerW, 1, ' ', rowFg, altBg);

      let rcx = innerX;
      const row = data[r] || [];
      for (let c = 0; c < columns.length; c++) {
        const w = columns[c].width || Math.floor(innerW / Math.max(1, columns.length));
        const val = String(row[c] ?? '').slice(0, Math.max(0, w - 1));
        renderer.text(rcx + 1, rowY, val, fg, altBg);
        rcx += w;
      }
    }
  }
}
