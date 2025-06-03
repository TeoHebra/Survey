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
let currentIndex = 0;

async function loadBlock(index) {
  const resp = await fetch(blockFiles[index]);
  const html = await resp.text();
  container.innerHTML = html;

  // If block 3, load its script
  if (index === 3) {
    const s = document.createElement('script');
    s.src = "js/block3-ranking.js";
    s.defer = true;
    document.body.appendChild(s);
  }

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
}

loadBlock(currentIndex);
