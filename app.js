const banks={craft:["{name}, your ideas have more texture than a secret level.","{name}, you make ordinary pixels look hand-crafted.","{name}, your brain has excellent color grading."],brave:["{name}, you press START before the boss music finishes.","{name}, your courage has legendary drop-rate energy.","{name}, you turn a scary blank screen into a playable world."],kind:["{name}, your kindness restores the whole party's HP.","{name}, you are the save point everyone needed.","{name}, your empathy has a rare, beautiful animation."],chaos:["{name}, your weird little spark is the best feature.","{name}, you bring delightful bonus content everywhere.","{name}, even your side quests have main-character energy."]};
const pick=a=>a[Math.floor(Math.random()*a.length)];
const roll=()=>50+Math.floor(Math.random()*50);
const rate=p=>p>85?'ULTRA RARE':p>65?'RARE':'NICE';
const praise=(vibe,name)=>pick(banks[vibe]).replace('{name}',()=>name.toUpperCase());
if (typeof document !== 'undefined') {
  const form = document.querySelector('#compliment-form');
  const handleInput = document.querySelector('#handle');
  const vibeInput = document.querySelector('#vibe');
  const output = document.querySelector('#compliment');
  const rarity = document.querySelector('#rarity');
  const copy = document.querySelector('#copy');
  const scoreEl = document.querySelector('#score');
  const maxEl = document.querySelector('#max');
  const comboEl = document.querySelector('#combo');
  const fill = document.querySelector('#score-fill');
  let current = '', score = 0, combo = 0, max = 0;
  let copyRequest = 0;
  let copyLabelTimer;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = handleInput.value.trim() || 'PLAYER ONE';
    const points = roll();
    current = praise(vibeInput.value, name);
    output.textContent = current;
    score += points;
    combo++;
    max = Math.max(max, points);
    scoreEl.textContent = String(score).padStart(3, '0');
    maxEl.textContent = String(max).padStart(3, '0');
    comboEl.textContent = `COMBO x${combo}`;
    fill.style.width = `${Math.min(100, score / 10)}%`;
    rarity.textContent = `RARITY: ${rate(points)}`;
    copyRequest++;
    clearTimeout(copyLabelTimer);
    copy.textContent = 'COPY';
    copy.disabled = false;
  });

  copy.addEventListener('click', async () => {
    const request = ++copyRequest;
    clearTimeout(copyLabelTimer);
    copy.textContent = 'COPY';
    try {
      await navigator.clipboard.writeText(current);
      if (request !== copyRequest) return;
      copy.textContent = 'COPIED!';
    } catch {
      if (request !== copyRequest) return;
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(output);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      copy.textContent = 'SELECT TEXT';
    }
    copyLabelTimer = setTimeout(() => { copy.textContent = 'COPY'; }, 1200);
  });
}
if(typeof module!=='undefined')module.exports={banks,pick,roll,rate,praise};
