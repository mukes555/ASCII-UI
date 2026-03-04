import { Component } from './Component.js';

// Toast notification: slides in from right, auto-dismisses
export class Toast extends Component {
    constructor(props) {
        super(props);
        this.width = props.width || 36;
        this.height = props.height || 3;
        this.visible = false;
        this._timeout = null;
        this._variant = props.variant || 'default'; // default, success, error, warning
        this.props.zIndex = props.zIndex || 9000;
        this.props.duration = props.duration || 2500;
    }

    show(message) {
        this.props.message = message || this.props.message || '';
        this.visible = true;
        if (this._timeout) clearTimeout(this._timeout);
        this._timeout = setTimeout(() => {
            this.visible = false;
            this._timeout = null;
        }, this.props.duration);
    }

    onRender(renderer) {
        if (!this.visible) return;
        const theme = renderer.theme;
        const { x, y } = this.absPosition;
        const msg = this.props.message || '';
        const variant = this.props.variant || 'default';

        let fg = theme.card?.fg ?? theme.normal?.fg ?? '#fff';
        let bg = theme.card?.bg ?? theme.surface?.bg ?? '#222';
        let bfg = theme.border?.fg ?? fg;

        if (variant === 'success') bfg = theme.success ?? '#0f0';
        else if (variant === 'error') bfg = theme.error ?? '#f00';
        else if (variant === 'warning') bfg = theme.warning ?? '#ff0';

        // Icon
        let icon = '*';
        if (variant === 'success') icon = '+';
        else if (variant === 'error') icon = '!';
        else if (variant === 'warning') icon = '?';

        renderer.rect(x + 1, y + 1, this.width - 2, this.height - 2, ' ', fg, bg);
        renderer.box(x, y, this.width, this.height, 'single', bfg, bg);

        const iconFg = bfg;
        renderer.text(x + 2, y + 1, icon, iconFg, bg);
        const text = msg.substring(0, this.width - 6);
        renderer.text(x + 4, y + 1, text, fg, bg);
    }
}
