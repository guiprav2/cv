import d from './dominant.js';
import localForage from 'https://cdn.skypack.dev/localforage';
import qs from 'https://cdn.skypack.dev/querystring';

window.d = d;
window.localForage = localForage;
window.arrayify = x => Array.isArray(x) ? x : [x];
window.tap = (x, y) => (y ? console.log(y, x) : console.log(x), x);

window.$ = (...args) => {
  let parent = typeof args[0] !== 'string' ? args.shift() : document;
  let sel = args.shift();
  return parent.querySelector(sel);
};

window.$$ = (...args) => {
  let parent = typeof args[0] !== 'string' ? args.shift() : document;
  let sel = args.shift();
  return [...parent.querySelectorAll(sel)];
};

window.html = x => d.el('template', { innerHTML: x });

window.jsx = (xs, ...ys) => {
  let o = '', as = {}, ns = {}, c = 1;

  for (let [i, x] of xs.entries()) {
    let y = ys[i];
    o += x;
    if (!y) { continue }

    let id = c++;

    if (y.constructor === Object) {
      as[id] = y;
      o += ` data-jsx-${id}`;
    }
    else {
      ns[id] = y;
      o += `<i data-jsx-${id}></i>`;
    }
  }

  let o2 = document.createElement('div');
  o2.innerHTML = o.trim();

  for (let [k, v] of Object.entries(as)) {
    let a = `data-jsx-${k}`;
    let n = o2.querySelector(`[${a}]`);
    n.removeAttribute(a);
    d.el(n, v);
  }

  for (let [k, v] of Object.entries(ns)) {
    let a = `data-jsx-${k}`;
    let n = o2.querySelector(`[${a}]`);
    n.replaceWith(...arrayify(v).map(
      x => x.tagName === 'TEMPLATE' ? x.content : x));
  }

  return o2.childNodes.length < 2 ? o2.childNodes[0] : [...o2.childNodes];
};

window.keyHandlers = cbs => ev => {
  let { key } = ev;
  if (ev.altKey) { key = `Alt-${key}` }

  if (ev.ctrlKey) {
    key = `Ctrl-${key}`;
    ev.target.tagName !== 'INPUT' && ev.preventDefault();
  }

  return cbs[key]?.(ev);
};

window.makePromise = () => {
  let res, rej, p = new Promise((res_, rej_) => {
    res = res_; rej = rej_;
  });

  return [p, res, rej];
};

window.nextFrame = async (n = 1) => {
  while (n--) {
    let [p, res] = makePromise();
    requestAnimationFrame(res);
    await p;
  }
};

window.transitionEnd = async x => {
  let [p, res] = makePromise();
  x.addEventListener('transitionend', res, { once: true });
  return p;
};

window.flash = async (x, cls = 'invert-0.3') => {
  cls = `tmp:${cls}`;
  x.classList.add(cls);
  await nextFrame(2);
  x.classList.add('tmp:transition-all');
  x.classList.remove(cls);
  await transitionEnd(x);
  x.classList.remove('tmp:transition-all');
};

window.fetchAll = async xs => {
  let data = {};

  for (let [k, v] of Object.entries(xs)) {
    let res = await fetch(v);
    if (!res.ok) { throw new Error(`cannot fetch ${v}`) }
    data[k] = await res.text();
  }

  return data;
};

window.timer = async x => {
  let t = Date.now();
  while (Date.now() - t < x * 1000) {
    await nextFrame(2);
  }
};

document.head.append(d.el('style', `
  pre, code { display: inline !important; }
  .hljs { background-color: transparent !important }

	.anim-bounce {
    --amplitude: 10px;
		animation-name: vibrate-fast;
		animation-duration: 1.2s;
		animation-timing-function: linear;
		animation-delay: 0s;
		animation-iteration-count: 1;
		animation-direction: normal;
		animation-fill-mode: none;
			
		/* shorthand
		animation: vibrate-fast 1.2s linear 0s 1 normal none;*/
	}
	@keyframes vibrate-fast {
		0% {
			transform:translate(0px,0px);
		}
		5% {
			transform:translate(0px,calc(var(--amplitude) * -1.0));
		}
		10% {
			transform:translate(0px,calc(var(--amplitude) * 0.9473684210526316));
		}
		15% {
			transform:translate(0px,calc(var(--amplitude) * -0.8947368421052632));
		}
		20% {
			transform:translate(0px,calc(var(--amplitude) * 0.8421052631578947));
		}
		25% {
			transform:translate(0px,calc(var(--amplitude) * -0.7894736842105263));
		}
		30% {
			transform:translate(0px,calc(var(--amplitude) * 0.7368421052631579));
		}
		35% {
			transform:translate(0px,calc(var(--amplitude) * -0.6842105263157895));
		}
		40% {
			transform:translate(0px,calc(var(--amplitude) * 0.6315789473684211));
		}
		45% {
			transform:translate(0px,calc(var(--amplitude) * -0.5789473684210526));
		}
		50% {
			transform:translate(0px,calc(var(--amplitude) * 0.5263157894736842));
		}
		55% {
			transform:translate(0px,calc(var(--amplitude) * -0.4736842105263158));
		}
		60% {
			transform:translate(0px,calc(var(--amplitude) * 0.4210526315789474));
		}
		65% {
			transform:translate(0px,calc(var(--amplitude) * -0.368421052631579));
		}
		70% {
			transform:translate(0px,calc(var(--amplitude) * 0.3157894736842105));
		}
		75% {
			transform:translate(0px,calc(var(--amplitude) * -0.2631578947368421));
		}
		80% {
			transform:translate(0px,calc(var(--amplitude) * 0.2105263157894737));
		}
		85% {
			transform:translate(0px,calc(var(--amplitude) * -0.1578947368421053));
		}
		90% {
			transform:translate(0px,calc(var(--amplitude) * 0.1052631578947369));
		}
		95% {
			transform:translate(0px,calc(var(--amplitude) * -0.05263157894736844));
		}
		100% {
			transform:translate(0px, 0px));
		}
	}
`));

window.typewrite = async (x, p) => {
  let body = async () => {
    if ([...x.classList].some(x => x.startsWith('anim-'))) {
      if (x.style.animationPlayState === 'running') {
        let [p, res] = makePromise;
        x.addEventListener('animationend', res, { once: true });
        await p;
      }
    }

    if (x.tagName === 'PRE' && x.firstChild.tagName === 'CODE') {
      let AsyncFunction = body.constructor;
      let p2 = p || x.parentNode, f = new AsyncFunction('x', x.textContent);
      return f(p, p2);
    }

    let q = [];
    q.push(...x.childNodes);
    x.innerHTML = '';
    all: while (true) {
      if (editor.execAborting) { break }
      let n = q.shift();
      if (!n) { break }
      if (n.nodeType === Node.TEXT_NODE) {
        let txt = n.textContent;
        while (txt) {
          if (editor.execAborting) { break all }
          let n2 = x.lastChild;
          if (n2?.nodeType !== Node.TEXT_NODE) {
            n2 = document.createTextNode('');
            x.append(n2);
          }
          txt[0] && await timer(typewrite.delay);
          n2.textContent += txt[0];
          txt = txt.slice(1);
        }
        break;
      }
      await timer(typewrite.delay);
      x.append(n);
      await typewrite(n, x);
    }
  };

  if (false && editor) { await editor.pause(body) }
  else { await body() }
};

typewrite.delay = 0.1;
window.sdl = x => typewrite.delay = x;

window.blocked = xs => {
  if (!xs.size) { return false }
  let y = false;
  for (let x of xs) {
    if (d.resolve(x)) { y = true; break }
  }
  return y;
};

window.classNameOf = x => {
  if (x.nodeType !== Node.ELEMENT_NODE) { return '' }
  return x.namespaceURI.includes('svg')
    ? x.className.baseVal : x.className;
};

window.setClassName = (x, y) => {
  return x.namespaceURI.includes('svg')
    ?  (x.className.baseVal = y) : (x.className = y);
};

window.mixin = (x, y) => {
  let inst = new (x)();
  let gs = Object.fromEntries(Object.entries(Object.getOwnPropertyDescriptors(
    Reflect.getPrototypeOf(inst))).filter(e => (e[0] !== 'constructor' && e[0] !== '__proto__')).map(e => {
      let v = e[1].value;
      if (typeof v === 'function') { e[1].value = v.bind(y) }
      return e;
    }));

  Object.defineProperties(Reflect.getPrototypeOf(y), gs);
};

// NOTE: Never resolves if cancelled by user
window.selectFile = async () => {
  let [p, res] = makePromise();
  let input = d.el('input', { type: 'file', class: 'hidden' });
  input.addEventListener('change', ev => res(input.files[0]));
  top.document.body.append(input);
  input.click();
  input.remove();
  return p;
};

window.readAsDataUrl = async f => {
  let [p, res, rej] = makePromise();
  let rd = new FileReader();
  rd.onload = () => res(rd.result);
  rd.onerror = ev => rej(ev);
  rd.readAsDataURL(await f);
  return p;
};

window.readAsArrayBuffer = async f => {
  let [p, res, rej] = makePromise();
  let rd = new FileReader();
  rd.onload = () => res(rd.result);
  rd.onerror = ev => rej(ev);
  rd.readAsArrayBuffer(await f);
  return p;
};

addEventListener('mousedown', ev => {
  let root = ev.target.closest('.scroll-drag');
  if (!root) { return }
  let { clientX, clientY } = ev;
  let { scrollLeft, scrollTop } = root;
  root.addEventListener('mousemove', mousemove);
  root.addEventListener('mouseup', mouseup);

  function mousemove(ev) {
    root.scrollLeft = scrollLeft - (ev.clientX - clientX);
    root.scrollTop = scrollTop - (ev.clientY - clientY);
  }

  function mouseup(ev) {
    root.removeEventListener('mousemove', mousemove);
    root.removeEventListener('mouseup', mouseup);
  }
});

addEventListener('click', ev => {
  let { target } = ev;
  if (target.getAttribute('href') === '#') { ev.preventDefault(); return }
  let method = target.getAttribute('data-method');

  if (method === 'POST') {
    ev.preventDefault();
    let form = d.el('form', { method, action: target.href });
    document.body.append(form);
    form.submit();
    form.remove();
  }
});

window.jsonLoad = async (path, opt) => {
  let res = await fetch(path, opt);
  if (!res.ok) { throw new Error(`failed to load json: ${res.status}`) }
  return res.json();
};

window.jsonPut = async (path, opt) => {
  let res = await fetch(path, {
    method: 'PUT',
    ...opt,
    headers: { ...opt.headers || {}, 'Content-Type': 'application/json' },
    body: JSON.stringify(opt.body),
  });

  if (!res.ok || !await res.json()) {
    throw new Error(`failed to put json: ${res.status}`);
  }

  return opt.body;
};

window.stringLoad = async (path, opt) => {
  let res = await fetch(path, opt);
  if (!res.ok) { throw new Error(`failed to load json: ${res.status}`) }
  return res.text();
};

window.stringPut = async (path, opt) => {
  let res = await fetch(path, {
    method: 'PUT',
    ...opt,
    headers: { ...opt.headers || {}, 'Content-Type': 'text/plain' },
    body: opt.body,
  });

  if (!res.ok || !await res.json()) {
    throw new Error(`failed to put string: ${res.status}`);
  }

  return opt.body;
};

class Requester {
  constructor(prefix = '') { this.prefix = prefix }

  get = async (path, opt) => {
    opt = { ...opt };
    let { q, withHeaders } = opt; delete opt.q; delete opt.withHeaders;
    q && (path += `?${qs.encode(q)}`);
    let res = await fetch(`${this.prefix}${path}`, opt);
    if (!res.ok) { throw new Error(`cannot get: ${res.status}`) }
    if (res.headers.get('content-type')?.startsWith('application/json')) {
      return withHeaders ? [res.headers, await res.json()] : res.json();
    }
    return withHeaders ? [res.headers, await res.text()] : res.text();
  };

  post = async (path, opt) => {
    opt = { ...opt };
    let { text, q } = opt; delete opt.text; delete opt.q;
    q && (path += `?${qs.encode(q)}`);
    let res = await fetch(`${this.prefix}${path}`, {
      method: 'POST',
      ...opt,
      headers: {
        ...opt.headers || {},
        'Content-Type': text ? 'text/plain' : 'application/json',
      },
      body: text ? opt.body : JSON.stringify(opt.body),
    });
    if (!res.ok) { throw new Error(`cannot post: ${res.status}`) }
    if (res.headers.get('content-type')?.startsWith('application/json')) {
      return res.json();
    }
    return res.text();
  };
}

window.req = new Requester();

window.showModal = async x => {
  let [p, res] = makePromise();
  document.body.append(x);
  x.returnValue = '';
  x.addEventListener('close', () => {
    x.remove();
    res([x.returnValue, x.returnValue2]);
  });
  x.showModal();
  return p;
};
