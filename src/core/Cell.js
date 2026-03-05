export class Cell {
  constructor() {
    this.char = ' ';       // The character to display
    this.fg = null;        // Foreground (text) colour, hex string. Null means inherit/default.
    this.bg = null;        // Background colour, hex string. Null means transparent/default.
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.scale = 0;        // Font-size scale multiplier (0 = default, e.g. 1.6, 1.3)
    this.blink = false;    // Optional: CSS animation for cursor blink
    this.dirty = true;     // Whether this cell needs re-rendering
    this.written = false;  // Whether this cell has been written to (for layer transparency)
  }

  set(char, fg, bg, bold, underline, italic, scale) {
    if (this.char !== char || this.fg !== fg || this.bg !== bg ||
      this.bold !== bold || this.underline !== underline || this.italic !== italic || this.scale !== (scale || 0)) {
      this.char = (char === undefined || char === null) ? ' ' : char;
      if (fg !== undefined) this.fg = fg;
      if (bg !== undefined) this.bg = bg;
      this.bold = bold || false;
      this.italic = italic || false;
      this.underline = underline || false;
      this.scale = scale || 0;
      this._scaledStr = null;
      this.dirty = true;
      this.written = true;
    }
  }

  clear() {
    this.char = ' ';
    this.fg = null;
    this.bg = null;
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.scale = 0;
    this.dirty = true;
    this.written = false;
  }

  equals(other) {
    return this.fg === other.fg && this.bg === other.bg &&
      this.bold === other.bold && this.italic === other.italic &&
      this.underline === other.underline && this.scale === other.scale;
  }
}
