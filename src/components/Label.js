import { Component } from './Component.js';

export class Label extends Component {
  get text() {
    return this.props.text || '';
  }

  set text(value) {
    this.props.text = value === undefined || value === null ? '' : String(value);
  }

  onRender(renderer) {
    const { fg, bg } = this.getColors(renderer);
    const { x, y } = this.absPosition;
    const text = this.props.text || '';
    const width = this.props.width || this.width;
    const wrap = !!this.props.wrap && typeof width === 'number' && width > 0;
    const inputLines = String(text).split('\n');
    const out = [];

    if (!wrap) {
      for (const l of inputLines) out.push(l);
    } else {
      for (const l of inputLines) {
        let s = l;
        while (s.length > width) {
          out.push(s.slice(0, width));
          s = s.slice(width);
        }
        out.push(s);
      }
    }

    const maxLines = this.props.height ? Math.min(this.props.height, out.length) : out.length;
    const isBold = !!this.props.bold;
    const isItalic = !!this.props.italic;
    for (let i = 0; i < maxLines; i++) {
      if (isBold) {
        renderer.boldText(x, y + i, out[i], fg, bg);
      } else if (isItalic) {
        renderer.italicText(x, y + i, out[i], fg, bg);
      } else {
        renderer.text(x, y + i, out[i], fg, bg);
      }
    }

    if (wrap && !this.props.height) {
      this.height = maxLines;
    }
  }
}
