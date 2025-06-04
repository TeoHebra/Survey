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
  const res = await fetch(blockFiles[index]);
  const html = await res.text();

  // Remove any previously inserted block(s)
  container.querySelectorAll('.survey-block').forEach(b => b.remove());

  // Insert the new block’s HTML
  container.insertAdjacentHTML('beforeend', html);
  const block = container.querySelector('.survey-block');
  block.classList.add('active');

  // ─── Re‐execute any <script> tags that came in with the HTML ───
  // (handles both inline <script>…</script> and external <script src="…">)
  const inertScripts = block.querySelectorAll('script');
  inertScripts.forEach(oldScript => {
    const newScript = document.createElement('script');

    if (oldScript.src) {
      // External <script src="…">
      newScript.src = oldScript.src;
      if (oldScript.defer) newScript.defer = true;
      if (oldScript.async) newScript.async = true;
      if (oldScript.type)  newScript.type  = oldScript.type;
    } else {
      // Inline <script>…</script>
      newScript.textContent = oldScript.textContent;
    }

    // Replace the inert node so the browser executes it
    oldScript.replaceWith(newScript);
  });

  bindNavigation(block);
  updateProgress();
}

function updateProgress() {
  const percent = (currentIndex / blockFiles.length) * 100;
  progressBar.firstElementChild.style.width = percent + '%';
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

// Start survey
loadBlock(currentIndex);
