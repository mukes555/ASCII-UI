import { AsciiUI } from '../src/AsciiUI.js?rev=20260304c';
import * as Themes from '../themes/index.js?rev=20260304c';

let isDark = false;

const ui = new AsciiUI('#app', {
  autoSize: true,
  theme: Themes.zincLight,
  fontSize: 14,
  continuousRender: true
});

// -- Sidebar --
const sidebar = ui.scrollContainer({
  x: 0, y: 0, width: 24, height: ui.screen.rows - 1,
  contentHeight: 80,
  highlightOnHover: false
});
ui.add(sidebar);

const sidebarContent = ui.panel({ x: 0, y: 0, width: 24, height: 80, borderStyle: 'none' });
sidebar.addChild(sidebarContent);

// -- Main --
const main = ui.scrollContainer({
  x: 24, y: 0, width: ui.screen.cols - 24, height: ui.screen.rows - 1,
  contentHeight: 380,
  highlightOnHover: false
});
ui.add(main);

// -- Footer --
const footer = ui.statusBar({
  x: 0, y: ui.screen.rows - 1, width: ui.screen.cols,
  segments: [{ text: '(c) 2026 ASCII UI', width: 20 }, { text: 'Showcase * Components', width: 24, align: 'right' }]
});
ui.add(footer);

const content = ui.panel({ x: 0, y: 0, width: main.width - 2, height: 380, borderStyle: 'none' });
main.addChild(content);

const sections = [
  { key: 'typography', label: 'Typography' },
  { key: 'buttons', label: 'Buttons' },
  { key: 'grid', label: 'Grid' },
  { key: 'form', label: 'Form' },
  { key: 'accordion', label: 'Accordion' },
  { key: 'tabs', label: 'Tabs' },
  { key: 'card', label: 'Card' },
  { key: 'dialog', label: 'Dialog' },
  { key: 'dropdown', label: 'Dropdown' },
  { key: 'alert', label: 'Alert & Badge' },
  { key: 'table', label: 'Table' },
  { key: 'navigation', label: 'Navigation' },
  { key: 'feedback', label: 'Feedback' }
];

// -- Sidebar Logo & Animated Mascot --
const navLinks = [];

// Mascot animation frames (wise owl)
const mascotFrames = [
  ' {o,o}\n /)__)\n  " "',
  ' {-,-}\n /)__)\n  " "',
  ' {o.o}\n /)__)\n  " "'
];
let mascotFrame = 0;
let mascotTimer = 0;

function makeLogo(cols) {
  if (cols >= 18) {
    return [
      '  ~~~~~~~~',
      '  ASCII UI',
      '  ~~~~~~~~'
    ].join('\n');
  }
  return ['ASCII', ' UI'].join('\n');
}

const logo = ui.label({ x: 2, y: 1, text: makeLogo(20), width: 20, wrap: false });
sidebarContent.addChild(logo);

// Animated mascot label
const mascotLabel = ui.label({ x: 5, y: 4, text: mascotFrames[0], width: 14, height: 3 });
sidebarContent.addChild(mascotLabel);

// Modern theme toggle switch in sidebar
const themeSwitch = ui['switch']({ x: 2, y: 8, label: 'Dark', checked: false });
sidebarContent.addChild(themeSwitch);

themeSwitch.on = {
  change: (isOn) => {
    isDark = isOn;
    const newTheme = isDark ? Themes.zinc : Themes.zincLight;
    ui.setTheme(newTheme);
    ui.render();
  }
};

// Divider below toggle
sidebarContent.addChild(ui.divider({ x: 2, y: 10, length: 18, style: 'dashed' }));

let navY = 12;
for (const s of sections) {
  const link = ui.link({ x: 2, y: navY, text: s.label, active: false });
  link.on.click = () => scrollTo(s.key);
  sidebarContent.addChild(link);
  navLinks.push({ key: s.key, node: link });
  navY += 1;
}
sidebarContent.height = navY + 2;
sidebar.props.contentHeight = sidebarContent.height;

// Animate mascot via engine tick
const origOnTick = ui.engine.onTick;
ui.engine.onTick = (dt, now) => {
  if (origOnTick) origOnTick(dt, now);
  mascotTimer += dt;
  if (mascotTimer > 1800) {
    mascotTimer = 0;
    mascotFrame = (mascotFrame + 1) % mascotFrames.length;
    mascotLabel.text = mascotFrames[mascotFrame];
    mascotLabel.props.text = mascotFrames[mascotFrame];
  }
};

// -- Content Sections --
const sectionY = {};
let y = 1;

function sectionHeader(text) {
  const lbl = ui.label({ x: 2, y, text, width: main.width - 6, wrap: true });
  content.addChild(lbl);
  y += lbl.height + 1;
}

function desc(text) {
  const lbl = ui.label({ x: 4, y, text, width: main.width - 8, wrap: true });
  content.addChild(lbl);
  y += lbl.height + 1;
}

function spacer(n) { y += (n || 1); }

function rule() {
  content.addChild(ui.divider({ x: 2, y, length: main.width - 6, style: 'dashed' }));
  y += 2;
}

function section(key, title) {
  sectionY[key] = y;
  sectionHeader(title);
}

// ========= TYPOGRAPHY =========
section('typography', 'Typography');
desc('Heading hierarchy, paragraph, and inline text styles.');
spacer();

// H1 -- bold banner with === underline
content.addChild(ui.label({ x: 4, y, text: 'Heading One (H1)', width: 40, bold: true }));
y += 1;
content.addChild(ui.label({ x: 4, y, text: '================', width: 40, bold: true }));
y += 2;

// H2 -- bold with --- underline
content.addChild(ui.label({ x: 4, y, text: 'Heading Two (H2)', width: 40, bold: true }));
y += 1;
content.addChild(ui.label({ x: 4, y, text: '- - - - - - - -', width: 40 }));
y += 2;

// H3 -- bold, no underline
content.addChild(ui.label({ x: 4, y, text: 'Heading Three (H3)', width: 40, bold: true }));
y += 2;

// H4 -- italic, lighter
content.addChild(ui.label({ x: 4, y, text: 'Heading Four (H4)', width: 40, italic: true }));
y += 2;

// Paragraph
desc('The quick brown fox jumps over the lazy dog. This is');
desc('a paragraph of body text rendered in pure ASCII.');
spacer();

// Actual bold text
content.addChild(ui.label({ x: 4, y, text: 'Bold text renders with real weight.', width: 50, bold: true }));
y += 1;
// Actual italic text
content.addChild(ui.label({ x: 4, y, text: 'Italic text renders with real style.', width: 50, italic: true }));
y += 2;

// Blockquote (italic)
content.addChild(ui.label({ x: 4, y, text: '| "Good design is as little design', width: 50, italic: true }));
y += 1;
content.addChild(ui.label({ x: 4, y, text: '|  as possible." -- Dieter Rams', width: 50, italic: true }));
y += 2;

// Divider
content.addChild(ui.divider({ x: 4, y, length: Math.min(main.width - 10, 50), style: 'single' }));
y += 2;
rule();

// ========= BUTTONS =========
section('buttons', 'Buttons');
desc('Six button variants for different contexts.');
spacer();

// Row 1: Default, Primary, Destructive (boxed)
content.addChild(ui.label({ x: 4, y, text: 'Default:', width: 10 }));
content.addChild(ui.label({ x: 18, y, text: 'Primary:', width: 10 }));
content.addChild(ui.label({ x: 34, y, text: 'Destructive:', width: 14 }));
y += 2;

const b1 = ui.button({ x: 4, y, label: 'Default' });
const b2 = ui.button({ x: 18, y, label: 'Primary', variant: 'primary' });
const b3 = ui.button({ x: 34, y, label: 'Destruct', variant: 'destructive' });
content.addChild(b1); content.addChild(b2); content.addChild(b3);
y += 4;
spacer();

// Row 2: Outline, Ghost, Link
content.addChild(ui.label({ x: 4, y, text: 'Outline:', width: 10 }));
content.addChild(ui.label({ x: 20, y, text: 'Ghost:', width: 10 }));
content.addChild(ui.label({ x: 38, y, text: 'Link:', width: 10 }));
y += 2;

const b4 = ui.button({ x: 4, y, label: 'Outline', variant: 'outline' });
const b5 = ui.button({ x: 20, y, label: 'Ghost', variant: 'ghost' });
const b6 = ui.button({ x: 38, y, label: 'Click me', variant: 'link' });
b6.on.click = () => toast('Link clicked!');
content.addChild(b4); content.addChild(b5); content.addChild(b6);
y += 4;
spacer();
rule();

// ========= GRID =========
section('grid', 'Grid');
desc('Responsive grid layout with panels.');
spacer();

const cW = Math.max(18, Math.floor((main.width - 14) / 3));
content.addChild(ui.panel({ x: 4, y, width: cW, height: 4, title: 'Col 4' }));
content.addChild(ui.panel({ x: 6 + cW, y, width: cW, height: 4, title: 'Col 4' }));
content.addChild(ui.panel({ x: 8 + cW * 2, y, width: cW, height: 4, title: 'Col 4' }));
y += 6;

content.addChild(ui.panel({ x: 4, y, width: cW * 2 + 2, height: 4, title: 'Col 8' }));
content.addChild(ui.panel({ x: 8 + cW * 2, y, width: cW, height: 4, title: 'Col 4' }));
y += 6;
rule();

// ========= FORM =========
section('form', 'Form Elements');
desc('Text input, select dropdown, checkbox, and switch.');
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Username', width: 20 }));
content.addChild(ui.label({ x: 36, y, text: 'Options', width: 20 }));
y += 2;

const input = ui.textInput({ x: 4, y, width: 28, placeholder: 'Enter username...' });
content.addChild(input);
const select = ui.select({ x: 36, y, width: 22, options: [{ label: 'Option 1' }, { label: 'Option 2' }] });
content.addChild(select);
y += 4;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Controls:', width: 12 }));
y += 2;

const cb = ui.checkbox({ x: 4, y, label: 'Enable notifications' });
content.addChild(cb);
y += 2;

const sw = ui['switch']({ x: 4, y, label: 'Airplane mode', checked: false });
content.addChild(sw);
y += 2;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Textarea:', width: 12 }));
y += 2;
const ta = ui.textarea({ x: 4, y, width: 40, height: 5, placeholder: 'Write something...' });
content.addChild(ta);
y += 6;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Slider:', width: 12 }));
y += 2;
const slider = ui.slider({ x: 6, y, width: 30, value: 40 });
content.addChild(slider);
y += 2;
spacer();

spacer();
rule();

// ========= ACCORDION =========
section('accordion', 'Accordion');
desc('Expandable content sections.');
spacer();

const acc = ui.accordion({
  x: 4, y, width: Math.min(main.width - 10, 60), height: 12,
  items: [
    { header: 'Is it accessible?', content: 'Yes. It adheres to ASCII-only patterns.' },
    { header: 'Is it styled?', content: 'Comes with multiple built-in themes.' },
    { header: 'Is it animated?', content: 'Uses the Motion class for tweens.' }
  ]
});
content.addChild(acc);
y += 14;
rule();

// ========= TABS =========
section('tabs', 'Tabs');
desc('Tabbed navigation with content panels.');
spacer();

const tabs = ui.tabs({
  x: 4, y, width: Math.min(main.width - 10, 60), height: 8, tabs: [
    { label: 'Account', content: 'Manage your account settings and preferences.' },
    { label: 'Password', content: 'Change your password here.' },
    { label: 'Team', content: 'Invite and manage team members.' }
  ]
});
content.addChild(tabs);
y += 10;
rule();

// ========= CARD =========
section('card', 'Card');
desc('Bordered card for grouping related content.');
spacer();

const card = ui.panel({ x: 4, y, width: Math.min(main.width - 10, 60), height: 8, title: 'Card Title', description: 'Card description text' });
card.addChild(ui.label({ x: 2, y: 3, text: 'This is a card component.', width: card.width - 4, wrap: true }));
card.addChild(ui.label({ x: 2, y: 4, text: 'Great for grouping related content.', width: card.width - 4, wrap: true }));
const cardAction = ui.button({ x: 2, y: 6, label: 'Action', variant: 'primary' });
card.addChild(cardAction);
content.addChild(card);
y += 10;
rule();

// ========= DIALOG =========
section('dialog', 'Dialog');
desc('Modal dialog with backdrop overlay.');
spacer();

const openDlg = ui.button({ x: 4, y, label: 'Open Dialog', variant: 'outline' });
content.addChild(openDlg);
y += 4;
spacer();

const dlg = ui.modal({
  title: 'Are you sure?',
  content: 'This action cannot be undone.\nThis will permanently delete your account.',
  buttons: ['Cancel', 'Continue']
});
dlg.props.on = { action: (label) => { if (label === 'Continue') toast('Confirmed!'); } };
openDlg.on.click = () => { ui.add(dlg); dlg.show(); ui.render(); };
rule();

// ========= DROPDOWN =========
section('dropdown', 'Dropdown');
desc('Select from a list of options.');
spacer();

const dd = ui.select({ x: 4, y, width: 26, options: [{ label: 'Action 1' }, { label: 'Action 2' }, { label: 'Action 3' }] });
content.addChild(dd);
y += 5;
spacer();
rule();

// ========= ALERT & BADGE =========
section('alert', 'Alert & Badge');
desc('Informational alerts and status badges.');
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Default alert:', width: 18 }));
y += 2;
content.addChild(ui.alert({ x: 4, y, width: Math.min(main.width - 10, 60), height: 3, text: 'This is an informational alert.' }));
y += 4;

content.addChild(ui.label({ x: 4, y, text: 'Destructive alert:', width: 20 }));
y += 2;
content.addChild(ui.alert({ x: 4, y, width: Math.min(main.width - 10, 60), height: 3, text: 'Destructive alert -- action required!', variant: 'destructive' }));
y += 4;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Badges:', width: 10 }));
y += 2;
content.addChild(ui.badge({ x: 4, y, text: 'Default' }));
content.addChild(ui.badge({ x: 14, y, text: 'Secondary', variant: 'secondary' }));
content.addChild(ui.badge({ x: 26, y, text: 'Outline', variant: 'outline' }));
content.addChild(ui.badge({ x: 36, y, text: 'Destruct', variant: 'destructive' }));
y += 2;
spacer();
rule();

// ========= TABLE =========
section('table', 'Table');
desc('Data display with headers and rows.');
spacer();

const table = ui.table({
  x: 4, y, width: Math.min(main.width - 10, 60), height: 10,
  columns: [{ header: 'ID', width: 8 }, { header: 'Name', width: 18 }, { header: 'Email', width: 22 }, { header: 'Status', width: 12 }],
  data: [
    ['1', 'Alice', 'alice@mail.com', 'Active'],
    ['2', 'Bob', 'bob@mail.com', 'Inactive'],
    ['3', 'Charlie', 'charlie@mail.com', 'Active']
  ],
  maxVisibleRows: 4
});
content.addChild(table);
y += 12;
rule();

// ========= NAVIGATION =========
section('navigation', 'Navigation');
desc('Breadcrumbs and pagination controls.');
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Breadcrumb:', width: 14 }));
y += 2;
content.addChild(ui.breadcrumb({ x: 6, y, width: Math.min(main.width - 10, 60), items: ['Home', 'Library', 'Data'] }));
y += 2;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Pagination:', width: 14 }));
y += 2;
content.addChild(ui.pagination({ x: 6, y, total: 5, page: 2 }));
y += 2;
spacer(2);
rule();

// ========= FEEDBACK =========
section('feedback', 'Feedback');
desc('Progress bars, spinners, toasts, and tooltips.');
spacer();

const toastBtn = ui.button({ x: 4, y, label: 'Show Toast', variant: 'outline' });
content.addChild(toastBtn);
y += 4;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Progress:', width: 12 }));
y += 2;
const prog = ui.progressBar({ x: 6, y, width: 40, value: 70 });
content.addChild(prog);
y += 2;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Indeterminate:', width: 16 }));
y += 2;
const progIndet = ui.progressBar({ x: 6, y, width: 40, value: 0, animate: true, indeterminate: true });
content.addChild(progIndet);
y += 2;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Meter:', width: 12 }));
y += 2;
const meter = ui.meter({ x: 6, y, width: 40, value: 80, animate: true });
content.addChild(meter);
y += 2;
spacer();

content.addChild(ui.label({ x: 4, y, text: 'Spinner:', width: 12 }));
const spinner = ui.spinner({ x: 14, y });
content.addChild(spinner);
y += 2;
spacer();

const tipBtn = ui.button({ x: 4, y, label: 'Hover Me', variant: 'outline' });
content.addChild(tipBtn);
const tooltip = ui.tooltip({ target: tipBtn, text: 'Tooltip content here!', width: 28, height: 4 });
ui.add(tooltip);
y += 4;
spacer();



// Set final content height
content.height = y + 4;
main.props.contentHeight = content.height;

// -- Toast (proper component) --
const toastComp = ui.toast({ x: ui.screen.cols - 38, y: 2, width: 36, variant: 'success', duration: 2500 });
ui.add(toastComp);

function toast(msg) {
  toastComp.show(msg);
  ui.render();
}
toastBtn.on.click = () => toast('Operation Successful!');

// -- Active nav tracking --
function updateActive() {
  const viewY = main.state.scrollY + 1;
  let active = sections[0]?.key;
  for (const s of sections) {
    if ((sectionY[s.key] ?? 0) <= viewY) active = s.key;
  }
  for (const item of navLinks) item.node.props.active = item.key === active;
}

const originalWheel = main.onWheel?.bind(main);
main.onWheel = (e) => {
  if (originalWheel) originalWheel(e);
  updateActive();
};

function scrollTo(key) {
  const y = sectionY[key] ?? 0;
  main.scrollTo(Math.max(0, y - 1));
  updateActive();
  ui.render();
}

// -- Relayout on resize --
const SIDEBAR_BREAKPOINT = 60; // cols threshold to show sidebar

let _relayouting = false;
function relayout() {
  if (_relayouting) return;
  _relayouting = true;

  // Adapt font size for viewport
  const vw = window.innerWidth || 800;
  let targetFont = 14;
  if (vw < 380) targetFont = 8;
  else if (vw < 480) targetFont = 9;
  else if (vw < 768) targetFont = 11;

  // Use proper API — re-measures chars & rebuilds grid
  ui.engine.renderer.setFontSize(targetFont);

  // Re-read actual cols/rows after font change
  const cols = ui.engine.renderer.cols;
  const rows = ui.engine.renderer.rows;
  ui.screen.cols = cols;
  ui.screen.rows = rows;
  const narrow = cols < SIDEBAR_BREAKPOINT;

  if (narrow) {
    // Collapse sidebar
    sidebar.visible = false;
    sidebar.width = 0;
    sidebar.props.width = 0;
    main.x = 0;
    main.width = cols;
    main.props.width = cols;
  } else {
    // Show sidebar
    sidebar.visible = true;
    sidebar.width = 24;
    sidebar.props.width = 24;
    sidebar.height = rows - 1;
    sidebar.props.height = rows - 1;
    sidebarContent.width = 24;
    sidebarContent.props.width = 24;
    const w = 24;
    logo.width = w - 4;
    logo.props.width = w - 4;
    logo.text = makeLogo(w - 4);
    logo.props.text = logo.text;
    main.x = 24;
    main.width = cols - 24;
    main.props.width = cols - 24;
  }

  main.height = rows - 1;
  main.props.height = rows - 1;
  content.width = main.width - 2;
  content.props.width = content.width;
  footer.y = rows - 1;
  footer.width = cols;
  footer.props.width = cols;
  toastComp.x = Math.max(0, cols - 38);
  _relayouting = false;
  ui.render();
}

ui.engine.afterResize = () => relayout();
relayout();
updateActive();

