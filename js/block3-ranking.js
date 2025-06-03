document.addEventListener('DOMContentLoaded', () => {
  const selects  = document.querySelectorAll('.rank-select');
  const nextBtn  = document.getElementById('submitRanking');
  const hiddenIn = document.getElementById('vignetteRanking');
  const items    = document.querySelectorAll('.ranking-item');

  function updateAll() {
    const chosen = [...selects].map(s => s.value).filter(Boolean);
    selects.forEach(sel => {
      const myVal = sel.value;
      [...sel.options].forEach(opt => {
        if (!opt.value) return;
        opt.disabled = chosen.includes(opt.value) && opt.value !== myVal;
      });
    });
    const allFilled = chosen.length === selects.length;
    const allUnique = new Set(chosen).size === selects.length;

    if (allFilled && allUnique) {
      nextBtn.disabled = false;
      const ordered = [];
      for (let r = 1; r <= selects.length; r++) {
        items.forEach(it => {
          const sel = it.querySelector('select');
          if (+sel.value === r) ordered.push(it.dataset.value);
        });
      }
      hiddenIn.value = ordered.join(',');
    } else {
      nextBtn.disabled = true;
      hiddenIn.value  = '';
    }
  }

  selects.forEach(s => s.addEventListener('change', updateAll));
  updateAll();
});
