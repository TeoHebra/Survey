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

// Create progress bar with wrapper and info text
const progressWrapper = document.createElement('div');
progressWrapper.className = 'progress-wrapper';
progressWrapper.innerHTML = `
  <div class="progress"><div></div></div>
  <div class="progress-info">Step 1 of ${blockFiles.length} · ~7 min left</div>
`;
container.prepend(progressWrapper);

let currentIndex = 0;

async function loadBlock(index) {
  const res = await fetch(blockFiles[index]);
  const html = await res.text();

  // Remove any previously inserted block(s)
  container.querySelectorAll('.survey-block').forEach(b => b.remove());

  // Insert the new block’s HTML
  container.insertAdjacentHTML('beforeend', html);
  const block = container.querySelector('.survey-block');
  block.classList.add('active');

  // Re-execute <script> tags that came in with the block
  const inertScripts = block.querySelectorAll('script');
  inertScripts.forEach(oldScript => {
    const newScript = document.createElement('script');
    if (oldScript.src) {
      newScript.src = oldScript.src;
      if (oldScript.defer) newScript.defer = true;
      if (oldScript.async) newScript.async = true;
      if (oldScript.type) newScript.type = oldScript.type;
    } else {
      newScript.textContent = oldScript.textContent;
    }
    oldScript.replaceWith(newScript);
  });

  bindNavigation(block);
  updateProgress();
}

function updateProgress() {
  const percent = ((currentIndex + 1) / blockFiles.length) * 100;
  document.querySelector('.progress > div').style.width = percent + '%';

  const stepsLeft = blockFiles.length - (currentIndex + 1);
  const estTime = Math.max(1, 7 - currentIndex); // crude estimate, adjust if needed
  document.querySelector('.progress-info').textContent = 
    `Step ${currentIndex + 1} of ${blockFiles.length} · ~${estTime} min left`;
}

function bindNavigation(block) {
  const nextBtn = block.querySelector('.next-btn');
  const prevBtn = block.querySelector('.prev-btn');

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

// Start the survey
loadBlock(currentIndex);
