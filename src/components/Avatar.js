import { Component } from './Component.js';

// Avatar: (AB) or [AB] with initials
export class Avatar extends Component {
    constructor(props) {
        super(props);
        this.width = props.size === 'lg' ? 6 : 4;
        this.height = props.size === 'lg' ? 3 : 1;
        this.props.initials = props.initials || props.text || '??';
        this.props.variant = props.variant || 'circle'; // circle or square
    }

    onRender(renderer) {
        const theme = renderer.theme;
        const { fg, bg } = this.getColors(renderer);
        const { x, y } = this.absPosition;
        const initials = String(this.props.initials).substring(0, 2).toUpperCase();
        const variant = this.props.variant;
        const accentBg = theme.muted?.bg ?? theme.accent?.bg ?? bg;
        const accentFg = theme.normal?.fg ?? fg;

        if (this.props.size === 'lg') {
            // Large: 3-line avatar
            if (variant === 'square') {
                renderer.box(x, y, this.width, this.height, 'single', theme.border?.fg ?? fg, accentBg);
                renderer.text(x + 1, y + 1, initials.padEnd(this.width - 2), accentFg, accentBg);
            } else {
                const w = this.width;
                renderer.text(x, y, '/' + '-'.repeat(w - 2) + '\\', theme.border?.fg ?? fg, bg);
                renderer.text(x, y + 1, '|', theme.border?.fg ?? fg, bg);
                const pad = Math.max(0, Math.floor((w - 2 - initials.length) / 2));
                const inner = ' '.repeat(pad) + initials + ' '.repeat(Math.max(0, w - 2 - pad - initials.length));
                renderer.text(x + 1, y + 1, inner, accentFg, accentBg);
                renderer.text(x + w - 1, y + 1, '|', theme.border?.fg ?? fg, bg);
                renderer.text(x, y + 2, '\\' + '-'.repeat(w - 2) + '/', theme.border?.fg ?? fg, bg);
            }
        } else {
            // Compact: single-line
            const open = variant === 'square' ? '[' : '(';
            const close = variant === 'square' ? ']' : ')';
            renderer.text(x, y, open + initials + close, accentFg, accentBg);
        }
    }
}
