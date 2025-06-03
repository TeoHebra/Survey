// block3‐ranking.js
document.addEventListener('DOMContentLoaded', () => {
  // ── 0. grab elements ─────────────────────────────────────────────
  const selects  = document.querySelectorAll('.rank-select');
  const nextBtn  = document.getElementById('submitRanking');
  const hiddenIn = document.getElementById('vignetteRanking');
  const items    = document.querySelectorAll('.ranking-item');

  // ── 1. function to rebuild disabled options & hidden field ───────
  function updateAll() {
    // 1a. collect currently chosen ranks (ignore empty values)
    const chosen = [...selects].map(s => s.value).filter(Boolean);

    // 1b. disable any option already picked elsewhere
    selects.forEach(sel => {
      const myVal = sel.value;
      [...sel.options].forEach(opt => {
        if (!opt.value) return; // skip the “Rank …” placeholder
        opt.disabled = chosen.includes(opt.value) && opt.value !== myVal;
      });
    });

    // 1c. enable “Next” only if every dropdown is filled and all unique
    const allFilled = chosen.length === selects.length;
    const allUnique = new Set(chosen).size === selects.length;

    if (allFilled && allUnique) {
      nextBtn.disabled = false;

      // 1d. Build hidden input value in rank order (1→vignette-id, 2→…)
      const ordered = [];
      for (let r = 1; r <= selects.length; r++) {
        items.forEach(it => {
          const sel = it.querySelector('select');
          if (+sel.value === r) {
            ordered.push(it.dataset.value);
          }
        });
      }
      hiddenIn.value = ordered.join(',');
    } else {
      nextBtn.disabled = true;
      hiddenIn.value  = '';
    }
  }

  // ── 2. wire up change listeners & run once on load ───────────────
  selects.forEach(s => s.addEventListener('change', updateAll));
  updateAll(); // in case any are pre-filled
});
// File: js/block3‐ranking.js
document.addEventListener('DOMContentLoaded', () => {
  const selects  = document.querySelectorAll('.rank-select');
  const nextBtn  = document.getElementById('submitRanking');
  const hiddenIn = document.getElementById('vignetteRanking');
  const items    = document.querySelectorAll('.ranking-item');

  function updateAll() {
    // 1. Gather all chosen (non‐empty) values
    const chosen = [...selects].map(s => s.value).filter(Boolean);

    // 2. Disable any <option> that’s already picked in another dropdown
    selects.forEach(sel => {
      const myVal = sel.value;
      [...sel.options].forEach(opt => {
        if (!opt.value) return; // skip the “Rank …” placeholder
        opt.disabled = chosen.includes(opt.value) && opt.value !== myVal;
      });
    });

    // 3. Only enable “Next” if all dropdowns are filled and unique
    const allFilled = chosen.length === selects.length;
    const allUnique = new Set(chosen).size === selects.length;

    if (allFilled && allUnique) {
      nextBtn.disabled = false;

      // 4. Build the hidden input’s comma-separated ranking string
      //    (rank 1 → data-value for that item, rank 2 → …, etc.)
      const ordered = [];
      for (let rank = 1; rank <= selects.length; rank++) {
        items.forEach(item => {
          const sel = item.querySelector('select');
          if (+sel.value === rank) {
            ordered.push(item.dataset.value);
          }
        });
      }
      hiddenIn.value = ordered.join(',');
    } else {
      nextBtn.disabled = true;
      hiddenIn.value  = '';
    }
  }

  // Attach change‐listeners to each <select>. Whenever one changes, recalc.
  selects.forEach(s => s.addEventListener('change', updateAll));

  // Run once on load in case any <select> is pre‐populated
  updateAll();
});
