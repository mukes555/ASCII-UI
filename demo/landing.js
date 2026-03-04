import { AsciiUI } from '../src/AsciiUI.js';
import * as Themes from '../themes/index.js';

const ui = new AsciiUI('#app', {
  autoSize: true,
  theme: Themes.minimalBw,
  fontSize: 14,
  continuousRender: true
});

const toastPanel = ui.panel({
  x: 0, y: 0, width: 30, height: 4,
  borderStyle: 'single',
  visible: false,
  zIndex: 2000,
  highlightOnHover: false
});
const toastLabel = ui.label({ x: 1, y: 1, text: '', width: 28, wrap: true });
toastPanel.addChild(toastLabel);
ui.add(toastPanel);

let toastTimeout;
function showToast(msg) {
  toastLabel.text = msg;
  toastPanel.visible = true;
  ui.render();
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastPanel.visible = false;
    ui.render();
  }, 2500);
}

const nav = ui.panel({
  x: 0, y: 0, width: ui.screen.cols, height: 3,
  borderStyle: 'none',
  highlightOnHover: false
});
ui.add(nav);

const brand = ui.label({ x: 2, y: 1, text: '[ TerminalAI ]' });
nav.addChild(brand);

const navDivider = ui.divider({ x: 0, y: 2, length: ui.screen.cols });
nav.addChild(navDivider);

const navLinks = [
  { key: 'features', label: 'Features' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'components', label: 'Components' },
  { key: 'faq', label: 'FAQ' },
  { key: 'get-started', label: 'Get Started' }
];

const links = [];
let linkX = 20;
for (const l of navLinks) {
  const link = ui.link({ x: linkX, y: 1, text: l.label, active: false });
  link.on.click = () => scrollToSection(l.key);
  nav.addChild(link);
  links.push({ key: l.key, node: link });
  linkX += l.label.length + 2;
}

const main = ui.scrollContainer({
  x: 0, y: 3, width: ui.screen.cols, height: ui.screen.rows - 4,
  contentHeight: 200,
  highlightOnHover: false
});
ui.add(main);

const footer = ui.statusBar({
  x: 0, y: ui.screen.rows - 1, width: ui.screen.cols,
  segments: [
    { text: ' (c) 2026 TerminalAI', width: 30 },
    { text: 'Components * FAQ', width: 20, align: 'right' }
  ]
});
ui.add(footer);

const canvas = ui.panel({
  x: 0, y: 0, width: ui.screen.cols - 2, height: 200,
  borderStyle: 'none',
  highlightOnHover: false
});
main.addChild(canvas);

const sections = {};
let y = 1;

function updateActiveNav() {
  const viewY = main.state.scrollY + 2;
  let activeKey = 'features';
  const ordered = Object.entries(sections).sort((a, b) => a[1] - b[1]);
  for (const [k, sy] of ordered) {
    if (sy <= viewY) activeKey = k;
  }
  for (const item of links) {
    item.node.props.active = item.key === activeKey;
  }
}

function heading(text) {
  const h = ui.label({ x: 2, y, text, width: ui.screen.cols - 6, wrap: true });
  canvas.addChild(h);
  y += 2;
  return h;
}

function paragraph(text) {
  const p = ui.label({ x: 2, y, text, width: ui.screen.cols - 6, wrap: true });
  canvas.addChild(p);
  y += p.height + 1;
  return p;
}

function divider() {
  const d = ui.divider({ x: 1, y, length: ui.screen.cols - 4 });
  canvas.addChild(d);
  y += 2;
  return d;
}

function section(key, title) {
  sections[key] = y;
  heading(title);
}

section('hero', 'Terminal-Native Intelligence');
paragraph('Build AI apps with crisp, text-first clarity.');
paragraph('Embeddings, RAG, and orchestration that feel like your favorite terminal tools -- fast, predictable, and delightful.');

const ctaWait = ui.button({ x: 2, y, label: 'Join Waitlist', variant: 'primary' });
ctaWait.on.click = () => showToast('Joined waitlist');
const ctaComp = ui.button({ x: 20, y, label: 'View Components' });
ctaComp.on.click = () => scrollToSection('components');
canvas.addChild(ctaWait);
canvas.addChild(ctaComp);
y += 4;

const pill1 = ui.badge({ x: 2, y, text: 'Fast' });
const pill2 = ui.badge({ x: 10, y, text: 'Deterministic' });
const pill3 = ui.badge({ x: 26, y, text: 'Observable' });
canvas.addChild(pill1);
canvas.addChild(pill2);
canvas.addChild(pill3);
y += 3;

divider();

section('features', 'Features');

function featureCard(x, w, title, bullets) {
  const h = bullets.length + 4;
  const card = ui.panel({ x, y, width: w, height: h, title });
  for (let i = 0; i < bullets.length; i++) {
    card.addChild(ui.label({ x: 1, y: 1 + i, text: `- ${bullets[i]}`.slice(0, w - 2), width: w - 2, wrap: true }));
  }
  canvas.addChild(card);
  return card;
}

const colW = Math.max(26, Math.floor((ui.screen.cols - 10) / 3));
featureCard(2, colW, 'Embeddings', [
  'Low-latency embeddings with high recall',
  'Batch and streaming modes',
  'Deterministic IDs'
]);
featureCard(4 + colW, colW, 'RAG Toolkit', [
  'Chunking and reranking',
  'Adapters for popular stores',
  'Guardrails and evals'
]);
featureCard(6 + colW * 2, colW, 'Orchestration', [
  'Composable DAGs',
  'Retries with backoff',
  'Structured logging'
]);
y += 8;

divider();

section('components', 'Try The API');

const code = `curl -X POST https://api.terminal.ai/v1/embed \\
  -H "Authorization: Bearer <API_KEY>" \\
  -H "Content-Type: application/json" \\
  -d '{ "input": "ASCII-native interfaces are beautiful." }'`;

const codeBox = ui.panel({ x: 2, y, width: Math.min(ui.screen.cols - 6, 72), height: 8, title: 'curl' });
codeBox.addChild(ui.label({ x: 1, y: 1, text: code, width: (codeBox.width - 2), height: 6 }));
canvas.addChild(codeBox);

const copyBtn = ui.button({ x: codeBox.x + codeBox.width + 2, y: y + 1, label: 'Copy Example' });
copyBtn.on.click = async () => {
  try {
    await navigator.clipboard.writeText(code);
    showToast('Copied');
  } catch (e) {
    showToast('Copy failed');
  }
};
const keyBtn = ui.button({ x: codeBox.x + codeBox.width + 2, y: y + 4, label: 'Get API Key', variant: 'primary' });
keyBtn.on.click = () => showToast('API key requested');
canvas.addChild(copyBtn);
canvas.addChild(keyBtn);
y += 10;

divider();

section('pricing', 'Simple, Transparent Pricing');

function pricingCard(x, w, plan, price, bullets, primary) {
  const h = bullets.length + 6;
  const card = ui.panel({ x, y, width: w, height: h, title: plan, borderStyle: primary ? 'double' : undefined });
  card.addChild(ui.label({ x: 1, y: 1, text: price, width: w - 2 }));
  for (let i = 0; i < bullets.length; i++) {
    card.addChild(ui.label({ x: 1, y: 2 + i, text: `- ${bullets[i]}`.slice(0, w - 2), width: w - 2 }));
  }
  const action = ui.button({ x: 1, y: h - 3, label: primary ? 'Upgrade' : 'Start', variant: primary ? 'primary' : 'default' });
  action.on.click = () => showToast(`${plan}: ${primary ? 'Upgrade' : 'Start'}`);
  card.addChild(action);
  canvas.addChild(card);
}

const pW = Math.max(22, Math.floor((ui.screen.cols - 10) / 3));
pricingCard(2, pW, 'Free', '$0 / mo', ['10k embeddings', 'RAG sandbox', 'Community support'], false);
pricingCard(4 + pW, pW, 'Pro', '$49 / mo', ['1M embeddings', 'Production RAG', 'Analytics & traces'], true);
pricingCard(6 + pW * 2, pW, 'Team', 'Custom', ['SLA and SSO', 'Private deployments', 'Dedicated support'], false);
y += 11;

divider();

section('faq', 'FAQ');

const faq = ui.accordion({
  x: 2, y, width: Math.min(ui.screen.cols - 6, 80), height: 10,
  items: [
    { header: 'Is TerminalAI open source?', content: 'Not yet. We plan to open-source the UI layer.' },
    { header: 'Which stores do you support?', content: 'Adapters planned for popular vector stores.\nPlus file + in-memory mode.' },
    { header: 'Can I self-host?', content: 'Yes, Team plan supports private deployments.' }
  ]
});
canvas.addChild(faq);
y += 12;

divider();

section('get-started', 'Get Started');
paragraph('Sign up to receive your API key and onboarding guide.');
const join = ui.button({ x: 2, y, label: 'Join Waitlist', variant: 'primary' });
join.on.click = () => showToast('Joined waitlist');
canvas.addChild(join);
y += 4;

canvas.height = y + 2;
main.contentHeight = canvas.height;
main.props.contentHeight = canvas.height;

function scrollToSection(key) {
  const y = sections[key] ?? sections['hero'] ?? 0;
  main.scrollTo(Math.max(0, y - 2));
  updateActiveNav();
  ui.render();
}

function relayout() {
  nav.width = ui.screen.cols;
  navDivider.props.length = ui.screen.cols;
  navDivider.width = ui.screen.cols;
  main.width = ui.screen.cols;
  main.height = ui.screen.rows - 4;
  footer.y = ui.screen.rows - 1;
  footer.width = ui.screen.cols;
  footer.props.width = ui.screen.cols;

  toastPanel.x = Math.max(0, ui.screen.cols - toastPanel.width - 2);
  toastPanel.y = 3;

  canvas.width = ui.screen.cols - 2;

  let linkX = 20;
  for (const item of links) {
    item.node.x = linkX;
    item.node.y = 1;
    item.node.width = String(item.node.props.text ?? '').length;
    linkX += item.node.width + 2;
  }

  ui.render();
}

ui.engine.afterResize = () => relayout();
relayout();

const originalWheel = main.onWheel?.bind(main);
main.onWheel = (e) => {
  if (originalWheel) originalWheel(e);
  updateActiveNav();
};
