import { AsciiUI } from '../src/AsciiUI.js';
import * as Themes from '../themes/index.js';

// ─── Boot ────────────────────────────────────────────────────
const ui = new AsciiUI('#app', {
    autoSize: true,
    theme: Themes.dark,
    fontSize: 14,
    continuousRender: true
});

const COLS = () => ui.screen.cols;
const ROWS = () => ui.screen.rows;

// ─── Toast ───────────────────────────────────────────────────
const toastPanel = ui.panel({ x: 0, y: 0, width: 36, height: 3, borderStyle: 'single', visible: false, zIndex: 9000, highlightOnHover: false });
const toastLabel = ui.label({ x: 1, y: 1, text: '', width: 34 });
toastPanel.addChild(toastLabel);
ui.add(toastPanel);
let toastTimer;
function toast(msg) {
    toastLabel.text = msg;
    toastPanel.visible = true;
    toastPanel.x = COLS() - 38;
    toastPanel.y = 1;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastPanel.visible = false; ui.render(); }, 2500);
    ui.render();
}

// ─── Nav Bar ─────────────────────────────────────────────────
const nav = ui.panel({ x: 0, y: 0, width: COLS(), height: 3, borderStyle: 'none', highlightOnHover: false });
ui.add(nav);

const logo = ui.label({ x: 2, y: 1, text: '◆ NeuralForge', bold: true });
nav.addChild(logo);

const navItems = ['Features', 'How it Works', 'Pricing', 'Contact'];
const navLinks = [];
let nx = 20;
for (const item of navItems) {
    const link = ui.link({ x: nx, y: 1, text: item });
    link.on.click = () => scrollTo(item.toLowerCase().replace(/ /g, '-'));
    nav.addChild(link);
    navLinks.push(link);
    nx += item.length + 3;
}

const navDiv = ui.divider({ x: 0, y: 2, length: COLS() });
nav.addChild(navDiv);

// ─── Footer ──────────────────────────────────────────────────
const footer = ui.statusBar({
    x: 0, y: ROWS() - 1, width: COLS(),
    segments: [
        { text: ' (c) 2026 NeuralForge', width: 24 },
        { text: 'Built with ASCII UI', width: 22, align: 'right' }
    ]
});
footer.zIndex = 100;
ui.add(footer);

// ─── Main scroll area ───────────────────────────────────────
const main = ui.scrollContainer({
    x: 0, y: 3, width: COLS(), height: ROWS() - 4,
    contentHeight: 300,
    highlightOnHover: false
});
ui.add(main);

const page = ui.panel({ x: 0, y: 0, width: COLS(), height: 300, borderStyle: 'none', highlightOnHover: false });
main.addChild(page);

const sections = {};
let y = 2;

// ─── Helpers ─────────────────────────────────────────────────
function addLabel(text, opts = {}) {
    const l = ui.label({ x: opts.x ?? 4, y, text, width: opts.width ?? COLS() - 8, wrap: true, bold: opts.bold, italic: opts.italic });
    page.addChild(l);
    y += (opts.height ?? 1) + (opts.gap ?? 1);
    return l;
}

function addDivider() {
    page.addChild(ui.divider({ x: 2, y, length: COLS() - 4 }));
    y += 2;
}

function sectionStart(key, title) {
    sections[key] = y;
    addLabel(title, { bold: true });
    const underLen = Math.min(title.length + 4, COLS() - 8);
    page.addChild(ui.divider({ x: 4, y: y - 1, length: underLen }));
}

// ═══════════════════════════════════════════════════════════════
//                          HERO
// ═══════════════════════════════════════════════════════════════

const heroArt = [
    '    _   __                    __  ______                    ',
    '   / | / /__  __  _________  / / / ____/___  _________ ___ ',
    '  /  |/ / _ \\/ / / / ___/ _ \\/ / / /_  / __ \\/ ___/ __ `/ _ \\',
    ' / /|  /  __/ /_/ / /  /  __/ / / __/ / /_/ / /  / /_/ /  __/',
    '/_/ |_/\\___/\\__,_/_/   \\___/_/ /_/    \\____/_/   \\__, /\\___/ ',
    '                                                 /____/      ',
];

const artX = Math.max(2, Math.floor((COLS() - 60) / 2));
for (const line of heroArt) {
    page.addChild(ui.label({ x: artX, y, text: line, width: 62 }));
    y++;
}
y += 1;

const tagline = 'Ship AI features in minutes, not months.';
const tagX = Math.max(4, Math.floor((COLS() - tagline.length) / 2));
addLabel(tagline, { x: tagX, bold: true, width: tagline.length + 2 });

const sub = 'Managed inference, embeddings, and orchestration.';
const subX = Math.max(4, Math.floor((COLS() - sub.length) / 2));
addLabel(sub, { x: subX, italic: true, width: sub.length + 2 });
y += 1;

// CTA buttons
const ctaX = Math.max(4, Math.floor(COLS() / 2 - 16));
const getStarted = ui.button({ x: ctaX, y, label: 'Get Started Free', variant: 'primary' });
getStarted.on.click = () => toast('Welcome to NeuralForge!');
page.addChild(getStarted);

const viewDocs = ui.button({ x: ctaX + 22, y, label: 'View Docs' });
viewDocs.on.click = () => toast('Docs coming soon');
page.addChild(viewDocs);
y += 4;

// Stats row
const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '<50ms', label: 'Latency' },
    { value: '10M+', label: 'API Calls/day' },
    { value: '500+', label: 'Companies' },
];
const statW = Math.floor((COLS() - 10) / 4);
for (let i = 0; i < stats.length; i++) {
    const sx = 4 + i * (statW + 1);
    page.addChild(ui.label({ x: sx + Math.floor(statW / 2) - Math.floor(stats[i].value.length / 2), y, text: stats[i].value, bold: true }));
    page.addChild(ui.label({ x: sx + Math.floor(statW / 2) - Math.floor(stats[i].label.length / 2), y: y + 1, text: stats[i].label, italic: true }));
}
y += 4;

addDivider();

// ═══════════════════════════════════════════════════════════════
//                        FEATURES
// ═══════════════════════════════════════════════════════════════

sectionStart('features', 'Features');
y += 1;

const features = [
    { title: 'Inference API', icon: '>>>', bullets: ['GPT-4, Claude, Gemini', 'Unified API', 'Auto-fallback & retry', 'Usage analytics'] },
    { title: 'Embeddings', icon: '[#]', bullets: ['Vector search', 'Batch processing', 'Multi-modal support', 'Custom models'] },
    { title: 'Orchestration', icon: '{*}', bullets: ['Chain prompts', 'Parallel execution', 'Built-in caching', 'Webhook triggers'] },
];

const cardW = Math.max(24, Math.floor((COLS() - 14) / 3));
for (let i = 0; i < features.length; i++) {
    const f = features[i];
    const fx = 4 + i * (cardW + 2);
    const cardH = f.bullets.length + 5;
    const card = ui.panel({ x: fx, y, width: cardW, height: cardH, title: `${f.icon} ${f.title}` });
    for (let j = 0; j < f.bullets.length; j++) {
        card.addChild(ui.label({ x: 1, y: 1 + j, text: `* ${f.bullets[j]}`, width: cardW - 3 }));
    }
    page.addChild(card);
}
y += features[0].bullets.length + 7;

addDivider();

// ═══════════════════════════════════════════════════════════════
//                      HOW IT WORKS
// ═══════════════════════════════════════════════════════════════

sectionStart('how-it-works', 'How it Works');
y += 1;

const steps = [
    { n: '1', title: 'Connect', desc: 'Get your API key and connect in one line of code.' },
    { n: '2', title: 'Build', desc: 'Use our SDK to add AI features: inference, search, RAG.' },
    { n: '3', title: 'Ship', desc: 'Deploy with confidence. We handle scaling & monitoring.' },
];

for (const step of steps) {
    const stepPanel = ui.panel({ x: 4, y, width: Math.min(COLS() - 8, 70), height: 4 });
    stepPanel.addChild(ui.label({ x: 1, y: 1, text: `[${step.n}]  ${step.title}`, bold: true, width: 20 }));
    stepPanel.addChild(ui.label({ x: 8, y: 2, text: step.desc, width: Math.min(COLS() - 20, 58), italic: true }));
    page.addChild(stepPanel);
    y += 5;
}

// Code example
y += 1;
addLabel('Quick Start:', { bold: true });
const codeW = Math.min(COLS() - 8, 60);
const codeBox = ui.panel({ x: 4, y, width: codeW, height: 10, title: 'example.js' });
const codeLines = [
    "import { NeuralForge } from 'neuralforge';",
    "",
    "const nf = new NeuralForge('your-api-key');",
    "",
    "const reply = await nf.chat({",
    "  model: 'gpt-4',",
    "  messages: [{ role: 'user',",
    "    content: 'Hello!' }]",
];
for (let i = 0; i < codeLines.length; i++) {
    codeBox.addChild(ui.label({ x: 1, y: 1 + i, text: codeLines[i], width: codeW - 3 }));
}
page.addChild(codeBox);
y += 12;

addDivider();

// ═══════════════════════════════════════════════════════════════
//                        PRICING
// ═══════════════════════════════════════════════════════════════

sectionStart('pricing', 'Pricing');
y += 1;

const plans = [
    { name: 'Hobby', price: 'Free', items: ['1K requests/day', '3 models', 'Community support'], primary: false },
    { name: 'Pro', price: '$29/mo', items: ['100K requests/day', 'All models', 'Priority support', 'Analytics'], primary: true },
    { name: 'Enterprise', price: 'Custom', items: ['Unlimited', 'Custom models', 'SLA & SSO', 'Dedicated infra'], primary: false },
];

const pW = Math.max(22, Math.floor((COLS() - 14) / 3));
for (let i = 0; i < plans.length; i++) {
    const p = plans[i];
    const px = 4 + i * (pW + 2);
    const pH = p.items.length + 7;
    const card = ui.panel({ x: px, y, width: pW, height: pH, title: p.name, borderStyle: p.primary ? 'double' : 'single' });
    card.addChild(ui.label({ x: 1, y: 1, text: p.price, bold: true, width: pW - 3 }));
    card.addChild(ui.divider({ x: 1, y: 2, length: pW - 2 }));
    for (let j = 0; j < p.items.length; j++) {
        card.addChild(ui.label({ x: 1, y: 3 + j, text: `- ${p.items[j]}`, width: pW - 3 }));
    }
    const btn = ui.button({ x: 1, y: pH - 3, label: p.primary ? 'Get Pro' : 'Start', variant: p.primary ? 'primary' : 'default' });
    btn.on.click = () => toast(`Selected: ${p.name}`);
    card.addChild(btn);
    page.addChild(card);
}
y += plans[1].items.length + 9;

addDivider();

// ═══════════════════════════════════════════════════════════════
//                       CONTACT / CTA
// ═══════════════════════════════════════════════════════════════

sectionStart('contact', 'Get in Touch');
y += 1;

addLabel('Try NeuralForge free. No credit card required.', { italic: true });
y += 1;

// Email input + button
page.addChild(ui.label({ x: 4, y, text: 'Email:', width: 8 }));
const emailInput = ui.textInput({ x: 12, y: y - 1, width: 30, placeholder: 'you@company.com' });
page.addChild(emailInput);

const submitBtn = ui.button({ x: 44, y: y - 1, label: 'Request Access', variant: 'primary' });
submitBtn.on.click = () => toast('Access requested! Check your email.');
page.addChild(submitBtn);
y += 4;

// FAQ
addLabel('FAQ', { bold: true });
const faq = ui.accordion({
    x: 4, y, width: Math.min(COLS() - 8, 70), height: 12,
    items: [
        { header: 'What models are supported?', content: 'GPT-4, Claude 3, Gemini, Llama, Mistral, and more.' },
        { header: 'Is there a free tier?', content: 'Yes! 1,000 requests/day, forever free.' },
        { header: 'Can I self-host?', content: 'Enterprise plan includes on-prem deployment options.' },
        { header: 'How is billing handled?', content: 'Pay-as-you-go or monthly. No hidden fees.' },
    ]
});
page.addChild(faq);
y += 16;
y += 2;

// ─── Finalize ────────────────────────────────────────────────
page.height = y + 4;
main.props.contentHeight = page.height;

function scrollTo(key) {
    const target = sections[key] ?? 0;
    main.scrollTo(Math.max(0, target - 2));
    ui.render();
}

function relayout() {
    nav.width = COLS();
    navDiv.props.length = COLS();
    navDiv.width = COLS();
    main.width = COLS();
    main.height = ROWS() - 4;
    footer.y = ROWS() - 1;
    footer.width = COLS();
    footer.props.width = COLS();
    page.width = COLS();
    toastPanel.x = COLS() - 38;
    toastPanel.y = 1;

    let lx = 20;
    for (const link of navLinks) {
        link.x = lx;
        lx += (link.props.text?.length ?? 8) + 3;
    }
    ui.render();
}

ui.engine.afterResize = () => relayout();
relayout();
