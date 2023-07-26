let numSteps = 50.0;

let styles = document.createElement('style');
styles.textContent = `
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

  [id] { opacity: 0; transition: 2s ease all }
  [id].fast { transition: 1s linear all }
  [id].visible { opacity: 1 }

  [id].visible.fadeDown {
    animation-name: fadeInDown;
    animation-duration: 2s;
    animation-fill-mode: both;
  }
`;
document.head.append(styles);

addEventListener('DOMContentLoaded', () => {
  let observer = new IntersectionObserver(xs => {
    for (let x of xs) {
      x.intersectionRatio > 0.5 && x.target.classList.add('visible');
    }
  }, { threshold: 0.5 });

  for (let x of document.querySelectorAll('[id]')) { observer.observe(x) }
}, false);
