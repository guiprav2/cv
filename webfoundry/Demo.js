import CodeDialog from './CodeDialog.js';
import InputDialog from './InputDialog.js';
import localForage from 'https://cdn.skypack.dev/localforage';

class Designer {
  constructor(props) {
    window.designer = this;
    this.props = props;
    this.actions = new ActionHandler(this);

    this.backend = {
      activeFile: 'demo.html', activeFileContents: `
        <div class="flow-root bg-neutral-100 sans auto-dark:bg-slate-900 h-screen overflow-auto">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-20 text-center lg:pt-20">
              <h1 class="mx-auto font-display font-medium tracking-tight text-slate-900 sm:text-7xl auto-dark:text-slate-200 max-w-7xl text-5xl">HTML &amp; Tailwind CSS <span class="relative whitespace-nowrap text-blue-600 auto-dark:hue-rotate-30"><span class="relative">made simple</span>
                  <svg aria-hidden="true" viewBox="0 0 418 42" class="absolute left-0 top-2/3 h-[0.58em] w-full fill-blue-300/70" preserveAspectRatio="none">
                      <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path>
                  </svg></span><br class=""><span class="">for tired web developers 😴</span>
              </h1>
          </div>
          <div class="grid grid-cols-3 justify-items-center">
              <div class=""></div>
              <div class="max-w-2xl shrink-0 w-screen transition-all duration-200 ease-linear">
                  <div style="padding:56.25% 0 0 0;position:relative;">
                      <iframe src="https://player.vimeo.com/video/854399081?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Get Webfoundry"></iframe>
                  </div>
                  <script src="https://player.vimeo.com/api/player.js"></script>
              </div>
              <div class="opacity-0 2xl:opacity-100 text-center font-2xl gfont-[Indie_Flower] text-[#914ab5] relative left-6 transition-all auto-dark:-hue-rotate-40 pt-12" style="filter: hue-rotate(-40deg);">
                  Try for free!
                  <img class="relative left-[-45%] mt-5" src="https://tiiny.host/assets/icons/arrow.svg">
              </div>
          </div>
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-32 text-center pt-12">
              <p class="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-900 auto-dark:text-slate-200/99">
                  Writing code is unavoidable, but designing components and web pages in code is tiresome. Take your skills to the fast lane and incorporate <span class="gfont-[Pacifico] text-2xl">Webfoundry</span><span class=""> into your workflow today.</span>
              </p>
              <div class="mt-10 flex justify-center gap-x-6">
                  <a class="group inline-flex rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 text-white hover:bg-slate-500 hover:text-slate-100 active:bg-slate-800 active:text-slate-300 focus-visible:outline-slate-900 auto-dark:text-slate-900 bg-slate-900 auto-dark:bg-neutral-200" href="/register" target="_top">Get 14 days free</a>
                  <a class="inline-flex rounded-full text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 py-2 px-3 auto-dark:text-neutral-100" href="/login" target="_top">Sign in</a>
              </div>
          </div>
      </div>
      `,
    };

    this.connectEditor();
  }

  get sidebar() { return this.sidebarNode.model }
  get s() { return this.editor?.s }
  set s(x) { this.editor.s = x }
  update() { d.update() }

  async connectEditor() {
    let { activeFile } = this.backend;
    let ext = activeFile.includes('.') ? activeFile.split('.').at(-1) : 'html';

    if (ext === 'html') {
      let [p, res, rej] = makePromise();
      this.content = d.el('iframe', { src: 'webfoundry/frame.html', class: 'w-full' });
      d.update();

      this.content.onload = () => {
        this.editor = this.content.contentWindow.connect(this);
        res(this.content);
      };

      this.content.onerror = () => rej(new Error('iframe load error'));

      return p;
    } else {
      let editorNode = this.content = jsx`<div class="w-full">`;
      d.updateSync();
      this.editor = ace.edit(editorNode);
      this.editor.setTheme('ace/theme/monokai');
      this.editor.session.setMode('ace/mode/javascript');
      this.editor.session.setValue(this.backend.activeFileContents);
      //ace.require("ace/ext/beautify").beautify(this.editor.session);
      this.editor.focus();
    }
  }

  closeEditor() {
    this.editor = this.content = null;
    d.update();
  }

  render = () => jsx`
    <div class="flex w-full bg-neutral-200">
      ${this.sidebarNode = d.el(Sidebar, { designer: this })}
      <div class="flex-1"></div>
      ${d.portal(() => this.content)}
    </div>
  `;
}

class Sidebar {
  constructor(props) {
    this.props = props;

    this.tabs = {
      styles: ['Styles', () => this.activeFile, d.el(StylesTab, { designer: this.designer })],
      actions: ['Actions', () => this.activeFile, d.el(ActionsTab, { designer: this.designer })],
    };
  }

  get designer() { return this.props.designer }
  get backend() { return this.designer.backend }
  get activeSite() { return this.backend.activeSite }
  get activeFile() { return this.backend.activeFile }

  get availableTabKeys() {
    return Object.keys(this.tabs).filter(x => !this.tabs[x][1] || this.tabs[x][1]());
  }

  activeTabKey = 'styles';
  get activeTab() { return this.tabs[this.activeTabKey][2] }

  render = () => jsx`
    <div
      class="w-80 h-screen shrink-0 flex flex-col bg-[#2b2d31] text-[#949ba4] sans shadow-2xl"
      ${{ model: this }}
    >
      <div class="flex justify-between items-center border-b border-[#1f2124] px-5 py-3">
        <span class="gfont-[Pacifico] text-gray-100">Webfoundry</span>
      </div>
      ${d.if(() => this.availableTabKeys.length >= 2, jsx`
        <div class="flex gap-3 justify-around border-b border-[#1f2124] p-3 text-sm">
          ${d.map(() => this.availableTabKeys, x => jsx`
            <a ${{
              class: () => x === this.activeTabKey && 'text-gray-100 underline',
              href: '#', onClick: () => this.activeTabKey = x,
            }}>
              ${this.tabs[x][0]}
            </a>
          `)}
        </div>
      `)}
      ${d.portal(() => this.activeTab)}
    </div>
  `;
}

class StylesTab {
  constructor(props) { window.styles = this; this.props = props }
  get designer() { return this.props.designer }
  get s() { return this.designer.s }
  get classes() { return !this.s || !this.s.className.trim() ? [] : this.s.className.split(/\s+/) }
  addClass(x) { this.s.classList.add(x) }
  replaceClass(x, y) { this.s.classList.remove(x); this.s.classList.add(y) }
  rmClass(ev, x) { ev && ev.stopPropagation(); this.s.classList.remove(x) }

  selectClass(x) {
    this.selectedClass = x;
    this.input.value = x;
    x ? this.input.select() : this.input.blur();
  }

  onKeyUp = ev => {
    if (ev.key === 'Escape') { this.selectClass(null) }

    if (ev.key === 'Enter') {
      let x = this.input.value.trim();

      if (x) {
        if (!this.selectedClass) { this.addClass(x) }
        else { this.replaceClass(this.selectedClass, x) }
      }

      this.input.value = '';
    }
  };

  render = () => jsx`
    <div>
      ${d.if(() => !this.s, jsx`
        <div class="p-5 text-sm italic">
          Select an element to see and change its styles.
        </div>
      `, jsx`
        <div class="flex flex-col gap-1 p-3 text-sm">
          ${d.map(() => this.classes, x => jsx`
            <a ${{
              class: [
                'px-3 py-1 flex gap-2 items-center rounded justify-between',
                () => this.selectedClass === x && 'bg-[#49586630] ',
              ],
              href: '#', onClick: () => this.selectClass(x),
            }}>
              <div class="flex gap-2 items-center">
                <div class="nf nf-fa-paint_brush"></div>
                <span>${x}</span>
              </div>
              <div class="flex gap-2">
                <button class="nf nf-fa-trash" ${{ onClick: ev => this.rmClass(ev, x) }}></button>
              </div>
            </a>
          `)}
          <div class="px-3 py-1 flex gap-2 items-center">
            <i ${{ class: ['nf', () => !this.selectedClass ? 'nf-fa-plus' : 'nf-md-file_replace_outline'] }}></i>
            ${this.input = jsx`
              <input
                class="bg-transparent outline-none flex-1"
                placeholder="add class" ${{ onKeyUp: this.onKeyUp }}
              >
            `}
          </div>
        </div>
      `)}
    </div>
  `;
}

class ActionsTab {
  constructor(props) { window.actions = this; this.props = props }

  get designer() { return this.props.designer }
  get actions() { return this.designer.actions }
  get s() { return this.designer.s }

  cmds = [
    ['Create / Remove', {
      createAfter: ['create after', 'o'],
      createBefore: ['create before', 'O'],
      createInsideFirst: ['create inside (first)', 'i'],
      createInsideLast: ['create inside (last)', 'I'],
      gptPrompt: ['add gpt prompt', 'G'],
      rm: ['remove', 'd'],
    }],

    ['Copy / Paste', {
      copy: ['copy', 'y'],
      pasteAfter: ['paste after', 'p'],
      pasteBefore: ['paste before', 'P'],
      pasteInsideFirst: ['paste inside (first)', 'Ctrl-Alt-p'],
      pasteInsideLast: ['paste inside (last)', 'Ctrl-Alt-P'],
    }],

    ['Change', {
      wrap: ['wrap', 'w'],
      unwrap: ['unwrap', 'W'],
      changeTag: ['change tag', 'e'],
      changeText: ['change text', 't'],
      changeMultilineText: ['change text (multiline)', 'T'],
      changeHref: ['change href', 'H'],
      changeSrcUrl: ['change src (URL)', 's'],
      changeBgUrl: ['change bg (URL)', 'b'],
      changeHtml: ['change HTML', 'm'],
      changeInnerHtml: ['change HTML (inner)', 'M'],
    }],
  ];

  render = () => jsx`
    <div class="flex flex-col overflow-hidden">
      ${d.if(() => !this.s, jsx`
        <div class="p-5 text-sm italic">Select an element to see all possible actions.</div>
      `, d.map(() => this.cmds, x => jsx`
        <div class="px-5 flex flex-col gap-2 py-4 not-first-child:pt-0 overflow-hidden">
          <div class="uppercase text-xs">${x[0]}</div>
          <div class="flex flex-col gap-1 overflow-auto">
            ${d.map(() => Object.keys(x[1]), y => jsx`
              <a
                class="flex justify-between items-center gap-2 rounded px-3 py-1 hover:text-[#dbdee1] hover:bg-[#77716830] cursor-default"
                ${{ href: '#', onClick: () => this.actions[y]() }}
              >
                <span>${x[1][y][0]}</span>
                <span class="mono">${x[1][y][1]}</span>
              </a>
            `)}
          </div>
        </div>
      `))}
    </div>
  `;
}

class ActionHandler {
  constructor(designer) { this.designer = designer }
  get backend() { return this.designer.backend }
  get editor() { return this.designer.editor }
  get pageRoot() { return this.editor.pageRoot }
  get s() { return this.designer.s }
  set s(x) { this.designer.s = x }

  sToggle = () => {
    let pe = this.s.closest('[contenteditable="true"]');
    if (pe) { pe.removeAttribute('contenteditable') }
    if (this.s) { this.sPrev = this.s; this.s = null }
    else { this.s = this.sPrev; this.sPrev = null }
    d.update();
    this.editor.update();
  };

  selectParent = () => this.select('parentElement');
  selectNext = () => this.select('nextElementSibling');
  selectPrev = () => this.select('previousElementSibling');
  selectFirstChild = () => this.select('firstElementChild');
  selectLastChild = () => this.select('lastElementChild');

  find = async (dir = 'forward') => {
    let [btn, value] = await showModal(d.el(InputDialog, {
      title: 'Find by selector', short: true,
      value: localStorage.getItem('lastFindSelector') || '',
    }));
    if (btn !== 'ok') { return }
    localStorage.setItem('lastFindSelector', value);
    this.findSelector = value;
    let found = [...this.pageRoot.querySelectorAll(value)];
    this.found = this.s = found.at(dir === 'forward' ? 0 : -1);
    this.found.scrollIntoView({ block: 'center' });
    d.update();
  };

  findMore = (dir = 'forward') => {
    if (!this.findSelector) { return }
    let found = [...this.pageRoot.querySelectorAll(this.findSelector)];
    let i = found.indexOf(this.found);

    if (i === -1) {
      this.found = found.at(dir === 'forward' ? 0 : -1);
    } else {
      this.found = found[i + (dir === 'forward' ? 1 : -1)];
      if (!this.found) {
        this.found = found.at(dir === 'forward' ? 0 : -1);
      }
    }

    this.found.scrollIntoView({ block: 'center' });
    this.s = this.found;
    d.update();
  };

  select = x => {
    let y = this.s[x];
    y && this.pageRoot.contains(y) && this.pageRoot !== y && (this.s = y);
    d.update();
    this.editor.update();
  };

  mvUp = () => this.mv(-1);
  mvDown = () => this.mv(1);

  mv = i => {
    let p = this.s.parentElement, j = [...p.childNodes].indexOf(this.s), k = 1, pv;
    while (true) {
      pv = p.childNodes[j + (i * k)];
      if (!pv || (pv.nodeType !== Node.COMMENT_NODE && pv.nodeType !== Node.TEXT_NODE) || pv.textContent.trim()) { break }
      k++;
    }
    pv && p.insertBefore(this.s, i < 1 ? pv : pv.nextSibling);
  };

  createAfter = () => this.create('afterend');
  createBefore = () => this.create('beforebegin');
  createInsideFirst = () => this.create('afterbegin');
  createInsideLast = () => this.create('beforeend');

  create = pos => {
    if (this.s.classList.contains('Placeholder') && (pos === 'afterbegin' || pos === 'beforeend')) { return }
    let x = jsx`<div class="Placeholder">`;
    this.s.insertAdjacentElement(pos, x);
    this.s = x;
    d.update();
    this.editor.update();
  };

  copy = async () => await localForage.setItem('copy', this.s.outerHTML);

  changeClipPath = async () => {
    let [btn, value] = await showModal(d.el(InputDialog, {
      title: 'Change clip path', value: this.s.style.clipPath,
    }));
    if (btn !== 'ok') { return }
    this.s.style.setProperty('clip-path', value.trim());
  };

  pasteAfter = () => this.paste('afterend');
  pasteBefore = () => this.paste('beforebegin');
  pasteInsideFirst = () => this.paste('afterbegin');
  pasteInsideLast = () => this.paste('beforeend');

  paste = async pos => {
    if (this.s.classList.contains('Placeholder') && (pos === 'afterbegin' || pos === 'beforeend')) { return }
    let x = jsx`<div>`;
    x.innerHTML = await localForage.getItem('copy');
    let y = x.firstElementChild;
    this.s.insertAdjacentElement(pos, y);
    this.s = y;
    d.update();
    this.editor.update();
  };

  rm = () => {
    this.copy();
    let p = this.s.parentElement, i = [...p.children].indexOf(this.s);
    this.s.remove();
    this.s = p.children[i] || p.children[i - 1] || p;
    d.update();
    this.editor.update();
  };

  wrap = () => this.wrapTagName('div');

  wrapTagName = x => {
    let p = this.s.parentElement, i = [...p.children].indexOf(this.s);
    this.s.outerHTML = `<${x}>${this.s.outerHTML}</${x}>`;
    this.s = p.children[i];
    d.update();
    this.editor.update();
  };

  unwrap = () => {
    let p = this.s.parentElement, i = [...p.children].indexOf(this.s);
    this.s.outerHTML = this.s.innerHTML;
    this.s = p.children[i];
    d.update();
    this.editor.update();
  };

  changeTag = async () => {
    let tagName = this.s.tagName.toLowerCase();
    let [btn, x] = await showModal(d.el(InputDialog, {
      short: true, title: 'Change tag', value: tagName,
    }));
    if (btn !== 'ok') { return }
    if (this.s.tagName === 'DIALOG' && x !== 'dialog') { this.s.open = false }
    this.changeTagName(x);
    if (x === 'dialog') { this.s.open = false; this.s.showModal() }
  };

  changeTagName = x => {
    let tagName = this.s.tagName.toLowerCase();
    let p = this.s.parentElement, i = [...p.children].indexOf(this.s);
    if (x === 'img' || x === 'video' || x === 'br' || x === 'hr') { this.s.innerHTML = '' }
    this.s.outerHTML = this.s.outerHTML.replace(tagName, x);
    this.s = p.children[i];
    d.update();
    this.editor.update();
  };

  changeText = async () => {
    let [btn, x] = await showModal(d.el(InputDialog, {
      title: 'Change text', value: this.s.textContent,
    }));
    if (btn !== 'ok') { return }
    this.s.textContent = x;
  };

  changeMultilineText = async () => {
    let [btn, x] = await showModal(d.el(InputDialog, {
      title: 'Change multiline text', multiline: true,
      value: this.s.textContent,
    }));
    if (btn !== 'ok') { return }
    this.s.textContent = x;
  };

  changeHref = async () => {
    let [btn, x] = await showModal(d.el(InputDialog, {
      short: true, title: 'Change href', value: this.s.getAttribute('href'),
    }));
    if (btn !== 'ok') { return }
    if (this.s.tagName === 'DIV' || this.s.tagName === 'SPAN') { this.changeTagName('a') }
    else if (this.s.tagName !== 'A') { this.wrapTagName('a') }
    if (x) { this.s.href = x } else { this.s.removeAttribute('href') }
  };

  changeSrcUrl = async () => {
    let [btn, x] = await showModal(d.el(InputDialog, {
      short: true, title: 'Change src', value: this.s.src,
    }));
    if (btn !== 'ok') { return }
    this.s.classList.toggle('Placeholder', false);
    this.s.tagName !== 'VIDEO' && this.changeTagName('img');
    if (x) { this.s.src = x } else { this.s.removeAttribute('src') }
  };

  changeBgUrl = async () => {
    let current = this.s.style.backgroundImage;
    let [btn, x] = await showModal(d.el(InputDialog, {
      short: true, title: 'Change background image',
      value: current.startsWith('url("') ? current.slice(5, -2) : current,
    }));
    if (btn !== 'ok') { return }
    this.s.classList.toggle('Placeholder', false);
    if (x) { this.s.style.backgroundImage = `url("${JSON.stringify(x)}")` }
    else { this.s.style.backgroundImage = '' }
  };

  changeHtml = async () => {
    let [btn, x] = await showModal(d.el(CodeDialog, {
      title: 'Change HTML', value: this.s.outerHTML,
    }));
    if (btn !== 'ok') { return }
    let p = this.s.parentElement, i = [...p.children].indexOf(this.s);
    this.s.outerHTML = x;
    this.s = p.children[i];
    d.update();
    this.editor.update();
  };

  changeInnerHtml = async () => {
    let [btn, x] = await showModal(d.el(CodeDialog, {
      title: 'Change inner HTML', value: this.s.innerHTML,
    }));
    if (btn !== 'ok') { return }
    this.s.innerHTML = x;
  };

  gptPrompt = async () => {
    let [btn, value] = await showModal(d.el(InputDialog, {
      title: 'Add a ChatGPT prompt as HTML', multiline: true,
    }));
    if (btn !== 'ok') { return }
    let t = this.s;
    t.classList.remove('Placeholder');
    t.textContent = 'Please wait while OpenAI works its magic...';
    let res = await req.post('/v1/gpt', {
      body: { prompt: `Generate only HTML with no explanations. Using Tailwind CSS, ${value}` },
    });
    let html = new DOMParser().parseFromString(res.result, 'text/html');
    t.innerHTML = html.body.innerHTML;
  };

  toggleDialog = () => {
    if (this.s.tagName !== 'DIALOG') { return }
    if (this.s.open) { this.s.close() } else { this.s.showModal() }
  };

  toggleEditable = ev => {
    let pe = this.s.closest('[contenteditable="true"]');
    if (!pe || pe === this.s) {
      let t = pe || this.s;
      if ([...this.s.querySelectorAll('*')].every(x => x.matches('span, button, input, ul, ol, li, br'))) { t = t.parentElement }
      if (!JSON.parse(pe?.contentEditable || false)) { t.contentEditable = true }
      else { t.removeAttribute('contenteditable') }
      ev.preventDefault();
    }
  };

  shiftHidden = i => {
    let p = this.s.parentElement, c = this.s;
    while (p) {
      if ([...p.children].some(x => x.classList.contains('hidden'))) { break }
      p = p.parentElement;
      c = c.parentElement;
    }
    if (!p) { return }
    let siblings = [...p.children];
    let j = siblings.indexOf(c) + i;
    if (j < 0) { j = siblings.length - 1 }
    else if (j > siblings.length - 1) { j = 0 }
    for (let x of siblings) { x.classList.add('hidden') }
    siblings[j].classList.remove('hidden');
    this.s = siblings[j];
    d.update();
  };

  shiftHiddenLeft = () => this.shiftHidden(-1);
  shiftHiddenRight = () => this.shiftHidden(1);

  kbds = {
    Escape: this.sToggle,
    h: this.selectParent,
    j: this.selectNext,
    J: this.mvDown,
    k: this.selectPrev,
    K: this.mvUp,
    l: this.selectFirstChild,
    L: this.selectLastChild,
    f: () => this.find('forward'),
    F: () => this.find('backward'),
    n: () => this.findMore('forward'),
    N: () => this.findMore('backward'),
    a: this.createAfter,
    A: this.createBefore,
    i: this.createInsideLast,
    I: this.createInsideFirst,
    d: this.rm,
    c: this.copy,
    C: this.changeClipPath,
    p: this.pasteAfter,
    P: this.pasteBefore,
    o: this.pasteInsideLast,
    O: this.pasteInsideFirst,
    w: this.wrap,
    W: this.unwrap,
    e: this.changeTag,
    t: this.changeText,
    T: this.changeMultilineText,
    H: this.changeHref,
    s: this.changeSrcUrl,
    b: this.changeBgUrl,
    m: this.changeHtml,
    M: this.changeInnerHtml,
    G: this.gptPrompt,
    x: this.toggleDialog,
    v: this.toggleEditable,
    '<': this.shiftHiddenLeft,
    '>': this.shiftHiddenRight,
  };
}

export default Designer;
