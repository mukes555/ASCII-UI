import { Component } from './Component.js';

// Multi-line text area
export class Textarea extends Component {
    constructor(props) {
        super(props);
        this.props.focusable = true;
        this.state.value = props.value || '';
        this.state.cursorPos = this.state.value.length;
        this.state.scrollY = 0;
        this.width = props.width || 40;
        this.height = props.height || 6;
        this.props.placeholder = props.placeholder || '';
        this._cursorVisible = true;
        this._cursorInterval = null;
    }

    _getLines() {
        const innerW = this.width - 2;
        const val = this.state.value || '';
        if (val.length === 0) return [''];
        // Split by newlines, then wrap each line
        const raw = val.split('\n');
        const lines = [];
        for (const line of raw) {
            if (line.length === 0) { lines.push(''); continue; }
            for (let i = 0; i < line.length; i += innerW) {
                lines.push(line.substring(i, i + innerW));
            }
        }
        return lines;
    }

    _cursorLineCol() {
        const innerW = this.width - 2;
        const val = this.state.value || '';
        const before = val.substring(0, this.state.cursorPos);
        const raw = before.split('\n');
        let lineIndex = 0;
        for (let i = 0; i < raw.length; i++) {
            const wrapped = Math.max(1, Math.ceil(raw[i].length / innerW) || 1);
            if (i < raw.length - 1) lineIndex += wrapped;
            else {
                const col = raw[i].length % innerW;
                const wrapRow = Math.floor(raw[i].length / innerW);
                lineIndex += wrapRow;
                return { line: lineIndex, col };
            }
        }
        return { line: 0, col: 0 };
    }

    onRender(renderer) {
        const theme = renderer.theme;
        const { fg, bg } = this.getColors(renderer);
        const fillBg = this.props.bg || theme.surface?.bg || bg;
        const fillFg = this.props.fg || theme.surface?.fg || fg;
        let bfg = theme.border?.fg || fg;
        const { x, y } = this.absPosition;
        const innerW = this.width - 2;
        const innerH = this.height - 2;

        const style = this.props.borderStyle || theme.borders?.control || 'single';
        if (this.state.focused) bfg = theme.ring?.fg || theme.focused?.bg || bfg;

        renderer.rect(x + 1, y + 1, innerW, innerH, ' ', fillFg, fillBg);
        renderer.box(x, y, this.width, this.height, style, bfg, fillBg);

        const val = this.state.value;
        const lines = this._getLines();

        // Auto-scroll to cursor
        const { line: cursorLine, col: cursorCol } = this._cursorLineCol();
        if (cursorLine >= this.state.scrollY + innerH) {
            this.state.scrollY = cursorLine - innerH + 1;
        } else if (cursorLine < this.state.scrollY) {
            this.state.scrollY = cursorLine;
        }

        // Render visible lines
        const isEmpty = val.length === 0;
        for (let i = 0; i < innerH; i++) {
            const lineIdx = this.state.scrollY + i;
            let text = '';
            let textFg = fillFg;
            if (isEmpty && i === 0 && this.props.placeholder) {
                text = this.props.placeholder.substring(0, innerW);
                textFg = theme.placeholder?.fg || theme.muted?.fg || fg;
            } else if (lineIdx < lines.length) {
                text = lines[lineIdx];
            }
            if (text.length > 0) {
                renderer.text(x + 1, y + 1 + i, text, textFg, fillBg);
            }
        }

        // Blinking cursor
        if (this.state.focused && this._cursorVisible) {
            const screenLine = cursorLine - this.state.scrollY;
            if (screenLine >= 0 && screenLine < innerH) {
                const cursorX = x + 1 + cursorCol;
                if (cursorX < x + this.width - 1) {
                    const cfg = theme.cursor?.fg ?? bg;
                    const cbg = theme.cursor?.bg ?? fg;
                    renderer.set(cursorX, y + 1 + screenLine, '|', cfg, cbg);
                }
            }
        }

        // Blink timer
        if (this.state.focused && !this._cursorInterval) {
            this._cursorVisible = true;
            this._cursorInterval = setInterval(() => { this._cursorVisible = !this._cursorVisible; }, 530);
        } else if (!this.state.focused && this._cursorInterval) {
            clearInterval(this._cursorInterval); this._cursorInterval = null; this._cursorVisible = true;
        }

        // Scrollbar indicator
        if (lines.length > innerH) {
            const thumbPos = Math.round((this.state.scrollY / Math.max(1, lines.length - innerH)) * (innerH - 1));
            const scrollFg = theme.scrollbar?.thumb || theme.muted?.fg || fg;
            for (let i = 0; i < innerH; i++) {
                const ch = i === thumbPos ? '#' : ':';
                renderer.set(x + this.width - 1, y + 1 + i, ch, scrollFg, fillBg);
            }
        }
    }

    onKeyDown(e) {
        const val = this.state.value;
        const pos = this.state.cursorPos;

        if (e.key === 'Backspace') {
            if (pos > 0) {
                this.state.value = val.slice(0, pos - 1) + val.slice(pos);
                this.state.cursorPos = pos - 1;
            }
        } else if (e.key === 'Delete') {
            if (pos < val.length) {
                this.state.value = val.slice(0, pos) + val.slice(pos + 1);
            }
        } else if (e.key === 'ArrowLeft') {
            if (pos > 0) this.state.cursorPos = pos - 1;
        } else if (e.key === 'ArrowRight') {
            if (pos < val.length) this.state.cursorPos = pos + 1;
        } else if (e.key === 'Enter') {
            this.state.value = val.slice(0, pos) + '\n' + val.slice(pos);
            this.state.cursorPos = pos + 1;
        } else if (e.key.length === 1) {
            this.state.value = val.slice(0, pos) + e.key + val.slice(pos);
            this.state.cursorPos = pos + 1;
        }

        this._cursorVisible = true;
        if (this.props.on && this.props.on.change) this.props.on.change(this.state.value);
        if (this.on && this.on.change) this.on.change(this.state.value);
    }
}
