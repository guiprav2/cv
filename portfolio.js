let styles = document.createElement('style');
styles.textContent = `
  @keyframes fadeIn {
    0% { opacity:0 }
    to { opacity:1 }
  }

  @keyframes fadeInDown {
    0% {
      opacity:0;
      transform:translate3d(0,-100%,0)
    }
    to {
      opacity:1;
      transform:translateZ(0)
    }
  }

  @keyframes fadeInDownLight {
    0% {
      opacity:0;
      transform:translate3d(0,-50%,0)
    }
    to {
      opacity:1;
      transform:translateZ(0)
    }
  }

  @keyframes fadeInLeft {
    0% {
      opacity:0;
      transform:translate3d(-100%,0,0)
    }
    to {
      opacity:1;
      transform:translateZ(0)
    }
  }

  [id] { opacity: 0 }

  [id].visible {
    transition: none;
    animation-name: fadeInDown;
    animation-duration: 2s;
    animation-fill-mode: both;
  }

  [id].fast { animation-duration: 1s }

  #id0001, #id0002, #id0003 {
    animation-name: fadeIn;
  }

  #id0001 {
    animation-duration: 3s;
  }

  #id0002 {
    animation-delay: 0.5s;
  }

  #id0003 {
    animation-delay: 1s;
  }

  #id0004 {
    animation-delay: 1s;
  }

  #id0019, [id="id0023.5"] {
    animation: none !important;
    opacity: 1;
  }
`;
document.head.append(styles);

if (location.pathname.includes('mony')) {
  styles.textContent += `
    #id0005, #id0006, #id0007, #id0008 #id0009 {
      animation-name: fadeInLeft !important;
    }
  `;
}

addEventListener('DOMContentLoaded', () => {
  let observer = new IntersectionObserver(xs => {
    for (let x of xs) {
      x.intersectionRatio > 0.5 && x.target.classList.add('visible');
    }
  }, { threshold: 0.5 });

  for (let x of document.querySelectorAll('[id]')) { observer.observe(x) }
}, false);

if (location.search.includes('autoscroll=1')) {
  let lastScrollY;
  function autoscroll() {
    let lock = lastScrollY && scrollY <= lastScrollY;
    lastScrollY = scrollY;

    requestAnimationFrame(() => {
      !lock && (document.documentElement.scrollTop += 5);
      requestAnimationFrame(autoscroll);
    });
  }

  setTimeout(autoscroll, 5000);
}
