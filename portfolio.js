let numSteps = 50.0;

let styles = document.createElement('style');
styles.textContent = `
  [id] { opacity: 0; transition: 2s ease all }
  [id].fast { transition: 1s linear all }
  [id].visible { opacity: 1 }
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
