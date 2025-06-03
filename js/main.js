// File: js/main.js

const blockFiles = [
  'blocks/block0-intro.html',
  'blocks/block1-open.html',
  'blocks/block2-likert.html',
  'blocks/block3-ranking.html',
  'blocks/block4-scaling.html',
  'blocks/block5-placeholder.html',
  'blocks/block6-demography.html'
];

const container = document.getElementById('survey-container');
const progressBar = document.createElement('div');
progressBar.className = 'progress';
progressBar.innerHTML = '<div></div>';
container.prepend(progressBar);

let currentIndex = 0;

async function loadBlock(index) {
  // 1. fetch the HTML for this block
  const resp = await fetch(blockFiles[index]);
  const html = await resp.text();

  // 2. inject it into the DOM
  container.innerHTML = html;

  // 3. Any <script> tags in that HTML were inert—re-create them so they execute:
  const inertScripts = container.querySelectorAll('script');
  inertScripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
      if (oldScript.defer)  newScript.defer = true;
      if (oldScript.type)   newScript.type  = oldScript.type;
      if (oldScript.async)  newScript.async = true;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.replaceWith(newScript);
  });
  // 4. If this is Block 3, append its JS:
  if (index === 3) {
    const s = document.createElement('script');
    s.src = "js/block3-ranking.js";
    s.defer = true;
    document.body.appendChild(s);
  }


  // 4. (Re-)bind your “Back” and “Next” buttons in the newly inserted block:
  const nextBtn = container.querySelector('.next-btn');
  const prevBtn = container.querySelector('.prev-btn');

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < blockFiles.length - 1) {
        currentIndex++;
        loadBlock(currentIndex);
      }
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        loadBlock(currentIndex);
      }
    });
  }

  // 5. Update progress bar width (for example)
  const progressInner = progressBar.querySelector('div');
  progressInner.style.width = ((index + 1) / blockFiles.length) * 100 + '%';
}

// Kick things off:
loadBlock(currentIndex);
