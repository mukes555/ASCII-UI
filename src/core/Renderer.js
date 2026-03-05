import { Cell } from './Cell.js';

export class Renderer {
  constructor(containerId, options = {}) {
    this.container = document.querySelector(containerId);
    this.cols = options.cols || 80;
    this.rows = options.rows || 25;
    this.charWidth = 0;
    this.charHeight = 0;
    this.theme = options.theme || {};
    this.fontSize = options.fontSize || 14;
    this.lineHeight = options.lineHeight || 1.25;
    this.fontFamily = options.fontFamily || 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

    this.buffer = [];
    this.initBuffer();
    this.createDOM();
  }

  initBuffer() {
    this.buffer = new Array(this.rows).fill(0).map(() =>
      new Array(this.cols).fill(0).map(() => new Cell())
    );
  }

  createDOM() {
    this.pre = document.createElement('div');
    Object.assign(this.pre.style, {
      margin: 0, padding: 0, overflow: 'hidden',
      fontFamily: this.fontFamily,
      fontSize: `${this.fontSize}px`, lineHeight: `${this.lineHeight}`,
      backgroundColor: this.theme.screen?.bg || '#000',
      color: this.theme.screen?.fg || '#fff',
      whiteSpace: 'pre',
      width: '100%', height: '100%'
    });
    this.container.innerHTML = '';
    this.container.appendChild(this.pre);

    const meas = document.createElement('div');
    Object.assign(meas.style, {
      position: 'absolute',
      visibility: 'hidden',
      left: '0',
      top: '0',
      whiteSpace: 'pre',
      fontFamily: this.fontFamily,
      fontSize: `${this.fontSize}px`,
      lineHeight: `${this.lineHeight}`,
      padding: '0',
      margin: '0'
    });
    const sample = 'M'.repeat(100);
    meas.textContent = `${sample}\n${sample}`;
    this.pre.appendChild(meas);
    const rect = meas.getBoundingClientRect();
    this.charWidth = rect.width / 100;
    this.charHeight = rect.height / 2;
    this.pre.removeChild(meas);

    this.buildRowDOM();
  }

  setTheme(theme) {
    this.theme = theme || {};
    this.pre.style.backgroundColor = this.theme.screen?.bg || '#000';
    this.pre.style.color = this.theme.screen?.fg || '#fff';
  }

  buildRowDOM() {
    this.rowEls = new Array(this.rows);
    this.prevRows = new Array(this.rows).fill(null);
    this.pre.innerHTML = '';
    for (let y = 0; y < this.rows; y++) {
      const row = document.createElement('div');
      this.rowEls[y] = row;
      this.pre.appendChild(row);
    }
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    if (this.charWidth > 0) {
      this.cols = Math.floor(rect.width / this.charWidth);
      this.rows = Math.floor(rect.height / this.charHeight);
      this.initBuffer();
      this.buildRowDOM();
    }
  }

  setFontSize(px) {
    if (px === this.fontSize) return;
    this.fontSize = px;
    this.pre.style.fontSize = `${px}px`;
    // Re-measure character dimensions
    const meas = document.createElement('div');
    Object.assign(meas.style, {
      position: 'absolute', visibility: 'hidden', left: '0', top: '0',
      whiteSpace: 'pre', fontFamily: this.fontFamily,
      fontSize: `${px}px`, lineHeight: `${this.lineHeight}`,
      padding: '0', margin: '0'
    });
    const sample = 'M'.repeat(100);
    meas.textContent = `${sample}\n${sample}`;
    this.pre.appendChild(meas);
    const rect = meas.getBoundingClientRect();
    this.charWidth = rect.width / 100;
    this.charHeight = rect.height / 2;
    this.pre.removeChild(meas);
    this.resize();
  }

  clear() {
    const bg = this.theme.screen?.bg;
    const fg = this.theme.screen?.fg;
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.buffer[y][x].set(' ', fg, bg);
      }
    }
  }

  set(x, y, char, fg, bg, bold, underline, italic, scale) {
    x = Math.floor(x);
    y = Math.floor(y);
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) return;
    const row = this.buffer[y];
    if (!row || !row[x]) return;
    row[x].set(char, fg, bg, bold, underline, italic, scale);
  }

  text(x, y, str, fg, bg) {
    for (let i = 0; i < str.length; i++) {
      this.set(x + i, y, str[i], fg, bg);
    }
  }

  boldText(x, y, str, fg, bg) {
    for (let i = 0; i < str.length; i++) {
      this.set(x + i, y, str[i], fg, bg, true, false, false);
    }
  }

  italicText(x, y, str, fg, bg) {
    for (let i = 0; i < str.length; i++) {
      this.set(x + i, y, str[i], fg, bg, false, false, true);
    }
  }

  underlineText(x, y, str, fg, bg) {
    for (let i = 0; i < str.length; i++) {
      this.set(x + i, y, str[i], fg, bg, false, true, false);
    }
  }

  scaledText(x, y, str, fg, bg, scale, bold) {
    // Write the full string as a single scaled block.
    // The first cell stores the string + scale info. Remaining cells are spacers.
    const cellSpan = Math.ceil(str.length * scale);
    this.set(x, y, str[0], fg, bg, bold || false, false, false, scale);
    // Store the full string on the first cell's buffer entry for flush() to read
    const row = this.buffer[Math.floor(y)];
    if (row && row[Math.floor(x)]) {
      row[Math.floor(x)]._scaledStr = str;
    }
    // Mark remaining cells as spacers
    for (let s = 1; s < cellSpan && (x + s) < this.cols; s++) {
      this.set(x + s, y, '', fg, bg, false, false, false, -1);
    }
  }

  rect(x, y, w, h, char, fg, bg) {
    for (let i = 0; i < h; i++) {
      for (let j = 0; j < w; j++) {
        this.set(x + j, y + i, char, fg, bg);
      }
    }
  }

  box(x, y, w, h, style = 'single', fg, bg) {
    const styles = {
      single: { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' },
      double: { tl: '#', tr: '#', bl: '#', br: '#', h: '=', v: '|' },
      rounded: { tl: '.', tr: '.', bl: '\'', br: '\'', h: '-', v: '|' },
      heavy: { tl: '*', tr: '*', bl: '*', br: '*', h: '=', v: '|' },
      dashed: { tl: '+', tr: '+', bl: '+', br: '+', h: '.', v: ':' },
      ascii: { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' }
    };

    const map = (style && typeof style === 'object') ? style : (styles[style] || styles.single);

    this.set(x, y, map.tl, fg, bg);
    this.set(x + w - 1, y, map.tr, fg, bg);
    this.set(x, y + h - 1, map.bl, fg, bg);
    this.set(x + w - 1, y + h - 1, map.br, fg, bg);

    for (let i = 1; i < w - 1; i++) {
      this.set(x + i, y, map.h, fg, bg);
      this.set(x + i, y + h - 1, map.h, fg, bg);
    }
    for (let i = 1; i < h - 1; i++) {
      this.set(x, y + i, map.v, fg, bg);
      this.set(x + w - 1, y + i, map.v, fg, bg);
    }
  }

  flush() {
    for (let y = 0; y < this.rows; y++) {
      let rowHtml = '';
      let prevStyle = '';

      for (let x = 0; x < this.cols; x++) {
        const cell = this.buffer[y][x];

        // Skip marker cells (occupied by a scaled character's overflow)
        if (cell.scale === -1) {
          // Still need to output a character to maintain grid width
          if (prevStyle) { rowHtml += '</span>'; prevStyle = ''; }
          rowHtml += '<span style="visibility:hidden;">&nbsp;</span>';
          continue;
        }

        const char = cell.char === undefined ? ' ' : cell.char;
        const fg = cell.fg || 'inherit';
        const bg = cell.bg || 'transparent';
        let style = `color:${fg};background:${bg};`;
        if (cell.bold) style += 'font-weight:bold;';
        if (cell.italic) style += 'font-style:italic;';
        if (cell.underline) style += 'text-decoration:underline;';

        // Scaled cells get rendered as a single large-font block
        if (cell.scale > 0 && cell._scaledStr) {
          if (prevStyle) { rowHtml += '</span>'; prevStyle = ''; }
          const scaledFontSize = Math.round(this.fontSize * cell.scale);
          let sStyle = `color:${fg};background:${bg};display:inline-block;font-size:${scaledFontSize}px;line-height:${this.charHeight}px;vertical-align:top;white-space:pre;`;
          if (cell.bold) sStyle += 'font-weight:bold;';
          // Escape the full string
          let escaped = '';
          for (const ch of cell._scaledStr) {
            if (ch === ' ') escaped += '&nbsp;';
            else if (ch === '&') escaped += '&amp;';
            else if (ch === '<') escaped += '&lt;';
            else if (ch === '>') escaped += '&gt;';
            else escaped += ch;
          }
          rowHtml += `<span style="${sStyle}">${escaped}</span>`;
          continue;
        }

        if (style !== prevStyle) {
          if (prevStyle) rowHtml += '</span>';
          rowHtml += `<span style="${style}">`;
          prevStyle = style;
        }

        if (char === ' ' || char === '') rowHtml += '&nbsp;';
        else if (char === '&') rowHtml += '&amp;';
        else if (char === '<') rowHtml += '&lt;';
        else if (char === '>') rowHtml += '&gt;';
        else rowHtml += char;
      }
      if (prevStyle) rowHtml += '</span>';
      if (this.prevRows[y] !== rowHtml) {
        this.rowEls[y].innerHTML = rowHtml;
        this.prevRows[y] = rowHtml;
      }
    }
  }
}
