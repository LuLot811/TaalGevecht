/**
 * Engels Boks — Brain Rot Boxing
 * Boksgevechten met Engelse leervragen (NL UI)
 */

const STORAGE_KEY = "engelsBoksSave";

const CONFIG = {
  xpWin: 35,
  xpLoss: 15,
};

const defaultSave = () => ({
  xp: 0,
  wins: 0,
  losses: 0,
});

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultSave(), ...JSON.parse(raw) };
  } catch (_) {
    /* ignore */
  }
  return defaultSave();
}

function writeSave(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// DOM
const screens = {
  menu: document.getElementById("screen-menu"),
  battle: document.getElementById("screen-battle"),
  result: document.getElementById("screen-result"),
};

const el = {
  menuLevel: document.getElementById("menu-level"),
  menuXp: document.getElementById("menu-xp"),
  menuWins: document.getElementById("menu-wins"),
  menuXpBar: document.getElementById("menu-xp-bar"),
  menuXpHint: document.getElementById("menu-xp-hint"),
  menuFighter: document.getElementById("menu-fighter"),
  unlockTrackFill: document.getElementById("unlock-track-fill"),
  unlockNodes: document.getElementById("unlock-nodes"),
  unlockNext: document.getElementById("unlock-next"),
  devLevelSelect: document.getElementById("dev-level-select"),
  btnFight: document.getElementById("btn-fight"),
  battlePlayerLevel: document.getElementById("battle-player-level"),
  playerHpFill: document.getElementById("player-hp-fill"),
  enemyHpFill: document.getElementById("enemy-hp-fill"),
  playerHpText: document.getElementById("player-hp-text"),
  enemyHpText: document.getElementById("enemy-hp-text"),
  roundBadge: document.getElementById("round-badge"),
  enemyName: document.getElementById("enemy-name"),
  playerSprite: document.getElementById("player-sprite"),
  enemySprite: document.getElementById("enemy-sprite"),
  enemyLabel: document.getElementById("enemy-label"),
  playerFighter: document.getElementById("player-fighter"),
  enemyFighter: document.getElementById("enemy-fighter"),
  battleMsg: document.getElementById("battle-msg"),
  questionType: document.getElementById("question-type"),
  questionPanel: document.getElementById("question-panel"),
  questionText: document.getElementById("question-text"),
  questionReviewOverlay: document.getElementById("question-review-overlay"),
  questionReviewClose: document.getElementById("question-review-close"),
  questionReviewQuestion: document.getElementById("question-review-question"),
  questionReviewUserAnswer: document.getElementById("question-review-user-answer"),
  questionReviewCorrectAnswer: document.getElementById("question-review-correct-answer"),
  questionReviewOk: document.getElementById("question-review-ok"),
  battleHistoryList: document.getElementById("battle-history-list"),
  battleHistoryEmpty: document.getElementById("battle-history-empty"),
  fillDutchWrap: document.getElementById("fill-dutch-wrap"),
  fillDutch: document.getElementById("fill-dutch"),
  choicesArea: document.getElementById("choices-area"),
  fillForm: document.getElementById("fill-form"),
  fillInput: document.getElementById("fill-input"),
  scramblePanel: document.getElementById("scramble-panel"),
  resultCard: document.getElementById("result-card"),
  resultTitle: document.getElementById("result-title"),
  resultEmoji: document.getElementById("result-emoji"),
  resultText: document.getElementById("result-text"),
  resultXp: document.getElementById("result-xp"),
  btnContinue: document.getElementById("btn-continue"),
  arena: document.querySelector(".arena"),
};

let save = loadSave();
let battle = null;
let currentQuestion = null;
let inputLocked = false;

function showScreen(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function getPlayerLevelInfo() {
  return getLevelFromXp(save.xp);
}

function refreshUnlockTrack() {
  const { fillPercent, skins, nextHint } = getUnlockTrackData(save.xp);

  el.unlockTrackFill.style.width = `${fillPercent}%`;
  el.unlockNext.textContent = nextHint;

  el.unlockNodes.innerHTML = skins
    .map((skin) => {
      const state = skin.current
        ? "current"
        : skin.unlocked
          ? "unlocked"
          : "locked";
      const lock = skin.unlocked ? "" : '<span class="unlock-lock" aria-hidden="true">🔒</span>';
      const avatarHtml = renderBoxer({
        skinId: skin.id,
        size: "mini",
        facing: "right",
        mystery: !skin.unlocked,
      });
      return `
        <div class="unlock-node ${state}" role="listitem" title="${skin.title} — level ${skin.minLevel}">
          <div class="unlock-avatar">${avatarHtml}</div>
          ${lock}
          <span class="unlock-lvl">Lv ${skin.minLevel}</span>
          <span class="unlock-name">${skin.title}</span>
        </div>
      `;
    })
    .join("");
}

function refreshMenu() {
  const { level, progress, needed } = getPlayerLevelInfo();
  const skin = getFighterSkin(level);

  el.menuLevel.textContent = level;
  el.menuXp.textContent = save.xp;
  el.menuWins.textContent = save.wins;
  el.menuXpBar.style.width = `${Math.min(100, (progress / needed) * 100)}%`;
  el.menuXpHint.textContent = `Nog ${needed - progress} XP tot level ${level + 1}`;
  setBoxerElement(el.menuFighter, {
    skinId: skinIdFromFighterSkin(skin),
    size: "large",
    facing: "right",
  });
  el.menuFighter.setAttribute("aria-label", `Jouw bokser: ${skin.title}`);
  refreshUnlockTrack();
  syncDevLevelSelect();
}

function initDevLevelSelect() {
  if (!el.devLevelSelect) return;

  const maxLevel = 25;
  el.devLevelSelect.innerHTML = "";

  for (let l = 1; l <= maxLevel; l++) {
    const option = document.createElement("option");
    option.value = String(l);
    option.textContent = `Level ${l}`;
    el.devLevelSelect.appendChild(option);
  }

  syncDevLevelSelect();

  el.devLevelSelect.addEventListener("change", () => {
    const level = parseInt(el.devLevelSelect.value, 10);
    if (!Number.isFinite(level) || level < 1) return;

    save.xp = totalXpToReachLevel(level);
    writeSave(save);
    refreshMenu();
  });
}

function syncDevLevelSelect() {
  if (!el.devLevelSelect) return;
  const { level } = getPlayerLevelInfo();
  el.devLevelSelect.value = String(level);
}

function startBattle() {
  const { level } = getPlayerLevelInfo();
  const skin = getFighterSkin(level);
  const enemy = getEnemyForLevel(level);

  battle = {
    playerLevel: level,
    playerHp: COMBAT.playerMaxHp,
    playerMaxHp: COMBAT.playerMaxHp,
    enemyHp: getEnemyMaxHp(level),
    enemyMaxHp: getEnemyMaxHp(level),
    playerDamage: getPlayerAttackDamage(level),
    enemyDamage: COMBAT.enemyAttackDamage,
    hitsToWin: getHitsToWin(level),
    correctHits: 0,
    round: 1,
    enemy,
    skin,
    correctStreak: 0,
    history: [],
  };

  clearBattleHistory();
  hideWrongAnswerOverlay();
  inputLocked = false;
  el.battlePlayerLevel.textContent = level;
  setBoxerElement(el.playerSprite, {
    skinId: skinIdFromFighterSkin(skin),
    facing: "right",
  });
  setBoxerElement(el.enemySprite, {
    enemyId: enemyIdFromEnemy(enemy),
    facing: "left",
  });
  el.enemyLabel.textContent = enemy.name;
  el.enemyName.textContent = enemy.name;
  el.battleMsg.textContent = `Klaar? ${battle.hitsToWin} goede antwoorden = knock-out!`;
  el.battleMsg.className = "battle-msg";

  updateHpBars();
  showScreen("battle");
  showNextQuestion();
}

function updateHpBars() {
  if (!battle) return;
  const pPct = (battle.playerHp / battle.playerMaxHp) * 100;
  const ePct = (battle.enemyHp / battle.enemyMaxHp) * 100;
  el.playerHpFill.style.width = `${pPct}%`;
  el.enemyHpFill.style.width = `${ePct}%`;
  el.playerHpText.textContent = `${Math.max(0, battle.playerHp)} / ${battle.playerMaxHp}`;
  el.enemyHpText.textContent = `${Math.max(0, battle.enemyHp)} / ${battle.enemyMaxHp}`;
  el.roundBadge.textContent = `Ronde ${battle.round}`;
}

function showNextQuestion() {
  if (!battle || inputLocked) return;

  currentQuestion = generateQuestion(battle.playerLevel);
  el.questionType.textContent = currentQuestion.typeLabel;
  el.questionText.innerHTML = currentQuestion.prompt;

  el.choicesArea.innerHTML = "";
  el.fillForm.classList.add("hidden");
  el.fillDutchWrap.classList.add("hidden");
  el.fillInput.value = "";
  if (el.scramblePanel) el.scramblePanel.classList.add("hidden");
  ScrambleUI.reset();
  el.questionText.classList.remove("hidden");

  el.questionPanel.classList.remove("question-panel--fill", "question-panel--scramble");

  if (currentQuestion.type === "mc") {
    currentQuestion.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "choice-btn";
      btn.textContent = opt;
      btn.addEventListener("click", () => handleAnswer(opt, btn));
      el.choicesArea.appendChild(btn);
    });
  } else if (currentQuestion.type === "scramble") {
    el.questionPanel.classList.add("question-panel--scramble");
    el.fillDutchWrap.classList.remove("hidden");
    el.fillDutch.textContent = currentQuestion.translation || "";
    el.questionText.classList.add("hidden");
    el.questionText.innerHTML = "";
    if (el.scramblePanel) {
      el.scramblePanel.classList.remove("hidden");
      ScrambleUI.setup(currentQuestion, (answer) => handleAnswer(answer, null));
    }
  } else {
    el.questionPanel.classList.add("question-panel--fill");
    el.fillDutchWrap.classList.remove("hidden");
    el.fillDutch.textContent = currentQuestion.translation || "";
    el.fillForm.classList.remove("hidden");
    setTimeout(() => el.fillInput.focus(), 100);
  }
}

function normalizeAnswer(str) {
  return str.trim().toLowerCase().replace(/[.!?]+$/, "");
}

function isCorrect(userAnswer) {
  if (currentQuestion.type === "mc") {
    return userAnswer === currentQuestion.answer;
  }
  if (currentQuestion.type === "scramble") {
    const built = userAnswer
      .trim()
      .split(/\s+/)
      .map((w) => w.toLowerCase().replace(/[.!?]+$/, ""));
    const expected = currentQuestion.words.map((w) =>
      w.toLowerCase().replace(/[.!?]+$/, "")
    );
    return (
      built.length === expected.length &&
      built.every((w, i) => w === expected[i])
    );
  }
  const norm = normalizeAnswer(userAnswer);
  return currentQuestion.accept.includes(norm);
}

function lockChoices() {
  el.choicesArea.querySelectorAll(".choice-btn").forEach((b) => {
    b.disabled = true;
  });
}

function handleAnswer(userAnswer, clickedBtn) {
  if (inputLocked || !battle || !currentQuestion) return;
  inputLocked = true;

  if (currentQuestion.type === "mc") {
    lockChoices();
    if (clickedBtn) {
      const correct = isCorrect(userAnswer);
      clickedBtn.classList.add(correct ? "correct" : "wrong");
      el.choicesArea.querySelectorAll(".choice-btn").forEach((b) => {
        if (b.textContent === currentQuestion.answer) b.classList.add("correct");
      });
    }
  }

  if (currentQuestion.type === "scramble") {
    ScrambleUI.lock();
  }

  const correct = isCorrect(userAnswer);

  const historyEntry = {
    round: battle.round,
    question: getQuestionHistoryText(currentQuestion),
    correctionHtml: getOverlayCorrectionHtml(currentQuestion),
    userAnswer: String(userAnswer),
    correctAnswer: currentQuestion.answer,
    correct,
  };
  recordBattleHistory(historyEntry);

  if (correct) {
    onCorrectHit();
  } else {
    onWrongHit(historyEntry);
  }
}

function getQuestionHistoryText(question) {
  if (question.type === "scramble") {
    return `${question.translation} → ${question.answer}`;
  }
  if (question.translation) {
    const english = question.prompt.replace(/<[^>]*>/g, "").trim();
    return `${question.translation} · ${english}`;
  }
  const tmp = document.createElement("div");
  tmp.innerHTML = question.prompt;
  return tmp.textContent || question.prompt;
}

function clearBattleHistory() {
  if (!el.battleHistoryList) return;
  el.battleHistoryList.innerHTML = "";
  if (el.battleHistoryEmpty) {
    el.battleHistoryEmpty.classList.remove("hidden");
  }
}

function recordBattleHistory(entry) {
  if (!battle || !el.battleHistoryList) return;

  battle.history.push(entry);

  if (el.battleHistoryEmpty) {
    el.battleHistoryEmpty.classList.add("hidden");
  }

  const item = document.createElement("li");
  item.className = `battle-history__item ${
    entry.correct ? "battle-history__item--hit" : "battle-history__item--miss"
  }`;

  const round = document.createElement("span");
  round.className = "battle-history__round";
  round.textContent = `Ronde ${entry.round}`;

  const question = document.createElement("p");
  question.className = "battle-history__question";
  question.textContent = entry.question;

  const answers = document.createElement("p");
  answers.className = "battle-history__answers";
  answers.appendChild(document.createTextNode("Jouw antwoord: "));
  const userStrong = document.createElement("strong");
  userStrong.textContent = entry.userAnswer || "—";
  answers.appendChild(userStrong);

  if (!entry.correct) {
    answers.appendChild(document.createTextNode(" · Goed was: "));
    const correctStrong = document.createElement("strong");
    correctStrong.textContent = entry.correctAnswer;
    answers.appendChild(correctStrong);
  }

  const result = document.createElement("span");
  result.className = "battle-history__result";
  const dmg = entry.correct ? battle.playerDamage : battle.enemyDamage;
  result.textContent = entry.correct
    ? `Raak! (−${dmg} HP tegenstander)`
    : `Geraakt! (−${dmg} HP voor jou)`;

  item.append(round, question, answers, result);
  el.battleHistoryList.appendChild(item);
  item.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function showDamagePopup(side, amount) {
  const pop = document.createElement("span");
  pop.className = "damage-pop";
  pop.textContent = `-${amount}`;
  const fighter = side === "player" ? el.playerFighter : el.enemyFighter;
  const rect = fighter.getBoundingClientRect();
  const arenaRect = el.arena.getBoundingClientRect();
  pop.style.left = `${rect.left - arenaRect.left + rect.width / 2}px`;
  pop.style.top = `${rect.top - arenaRect.top}px`;
  el.arena.style.position = "relative";
  el.arena.appendChild(pop);
  setTimeout(() => pop.remove(), 900);
}

function onCorrectHit() {
  battle.enemyHp -= battle.playerDamage;
  battle.correctHits++;
  battle.correctStreak++;
  el.battleMsg.textContent = getRandomPhrase(HIT_PHRASES);
  el.battleMsg.className = "battle-msg right";
  triggerSuccessAnimation();

  el.playerFighter.classList.remove("punch-right");
  void el.playerFighter.offsetWidth;
  el.playerFighter.classList.add("punch-right");
  launchAttack({
    type: getPlayerAttackType(skinIdFromFighterSkin(battle.skin)),
    fromFighter: el.playerFighter,
    toFighter: el.enemyFighter,
    arena: el.arena,
  });
  el.enemyFighter.classList.add("hit");
  showDamagePopup("enemy", battle.playerDamage);

  updateHpBars();
  continueToNextQuestionImmediately();

  setTimeout(() => {
    el.enemyFighter.classList.remove("hit");
  }, 700);
}

function triggerSuccessAnimation() {
  if (!el.questionPanel) return;
  el.questionPanel.classList.remove("question-panel--success");
  void el.questionPanel.offsetWidth;
  el.questionPanel.classList.add("question-panel--success");
  setTimeout(() => {
    el.questionPanel.classList.remove("question-panel--success");
  }, 420);
}

function onWrongHit(historyEntry) {
  battle.playerHp -= battle.enemyDamage;
  battle.correctStreak = 0;
  el.battleMsg.textContent = getRandomPhrase(MISS_PHRASES);
  el.battleMsg.className = "battle-msg wrong";

  el.enemyFighter.classList.remove("punch-left");
  void el.enemyFighter.offsetWidth;
  el.enemyFighter.classList.add("punch-left");
  launchAttack({
    type: getEnemyAttackType(enemyIdFromEnemy(battle.enemy)),
    fromFighter: el.enemyFighter,
    toFighter: el.playerFighter,
    arena: el.arena,
  });
  el.playerFighter.classList.add("hit");
  showDamagePopup("player", battle.enemyDamage);

  if (currentQuestion.type === "mc") {
    el.battleMsg.textContent += ` Het juiste antwoord was: ${currentQuestion.answer}`;
  } else {
    el.battleMsg.textContent += ` Het juiste antwoord was: ${currentQuestion.answer}`;
  }

  updateHpBars();
  if (battle.playerHp > 0) {
    showWrongAnswerOverlay(historyEntry);
  }
  continueToNextQuestionImmediately();
  setTimeout(() => {
    el.playerFighter.classList.remove("hit");
  }, 900);
}

function showWrongAnswerOverlay(historyEntry) {
  if (!historyEntry || !el.questionReviewOverlay) return;
  el.questionReviewQuestion.innerHTML = historyEntry.correctionHtml || historyEntry.question || "Vraag";
  el.questionReviewUserAnswer.textContent = historyEntry.userAnswer || "—";
  el.questionReviewCorrectAnswer.textContent = historyEntry.correctAnswer || "—";
  el.questionReviewOverlay.classList.remove("question-review-overlay--hidden");
}

function hideWrongAnswerOverlay() {
  if (!el.questionReviewOverlay) return;
  el.questionReviewOverlay.classList.add("question-review-overlay--hidden");
}

function continueAfterWrongReview() {
  if (!battle) return;
  hideWrongAnswerOverlay();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getOverlayCorrectionHtml(question) {
  if (!question) return "";
  const correctWordHtml = `<strong class="question-review-correct-word">${escapeHtml(
    question.answer || "?"
  )}</strong>`;

  if (question.type === "scramble") {
    return `${escapeHtml(question.translation || "")} -> ${correctWordHtml}`;
  }

  const promptHtml = String(question.prompt || "");
  const withBlankReplaced = promptHtml.replace(
    /<span class="blank">.*?<\/span>/i,
    correctWordHtml
  );
  const withTokenReplaced = withBlankReplaced.replace(/\?\?\?|___/, correctWordHtml);
  return withTokenReplaced;
}

function checkBattleEnd() {
  if (battle.correctHits >= battle.hitsToWin) {
    endBattle(true);
    return true;
  }
  if (battle.enemyHp <= 0) {
    endBattle(true);
    return true;
  }
  if (battle.playerHp <= 0) {
    endBattle(false);
    return true;
  }
  return false;
}

function continueToNextQuestionImmediately() {
  if (!battle) return;
  if (checkBattleEnd()) return;
  battle.round++;
  inputLocked = false;
  showNextQuestion();
}

function endBattle(won) {
  const oldLevel = getPlayerLevelInfo().level;

  if (won) {
    save.xp += CONFIG.xpWin;
    save.wins += 1;
  } else {
    save.xp = Math.max(0, save.xp - CONFIG.xpLoss);
    save.losses += 1;
  }

  writeSave(save);

  const newLevel = getPlayerLevelInfo().level;
  const leveledUp = newLevel > oldLevel;

  el.resultCard.className = `result-card ${won ? "win" : "lose"}`;

  if (won) {
    el.resultTitle.textContent = "KNOCK-OUT!";
    el.resultEmoji.textContent = "🏆";
    el.resultText.textContent = leveledUp
      ? `Je hebt ${battle.enemy.name} verslagen! Nieuwe level: ${newLevel}! Je bokser is sterker geworden!`
      : `Je hebt ${battle.enemy.name} verslagen! Ga zo door!`;
    el.resultXp.textContent = `+${CONFIG.xpWin} XP`;
  } else {
    el.resultTitle.textContent = "VERLOREN...";
    el.resultEmoji.textContent = "😵";
    el.resultText.textContent = `${battle.enemy.name} was te sterk deze keer. Oefen nog een rondje!`;
    el.resultXp.textContent = `-${CONFIG.xpLoss} XP`;
  }

  if (leveledUp) {
    el.resultCard.classList.add("level-up-flash");
    const skin = getFighterSkin(newLevel);
    el.resultText.textContent += ` Nieuwe titel: ${skin.title}!`;
  }

  battle = null;
  currentQuestion = null;
  hideWrongAnswerOverlay();
  refreshMenu();
  showScreen("result");
}

const HIT_PHRASES = [
  "POW! Raak! 💥",
  "Mega slag! ⚡",
  "Knock-out klop! 🥊",
  "Yes! Goed antwoord! ✅",
  "Rizz attack! 😎",
];

const MISS_PHRASES = [
  "Au! Fout antwoord! 💢",
  "Oeps! Je werd geraakt!",
  "Niet goed... BAM! 😵",
  "Hmm, probeer nog eens!",
  "De tegenstander lacht... 😬",
];

function getRandomPhrase(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Events
el.btnFight.addEventListener("click", startBattle);

el.fillForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputLocked) return;
  handleAnswer(el.fillInput.value, null);
});

if (el.questionReviewClose) {
  el.questionReviewClose.addEventListener("click", continueAfterWrongReview);
}

if (el.questionReviewOk) {
  el.questionReviewOk.addEventListener("click", continueAfterWrongReview);
}

el.btnContinue.addEventListener("click", () => {
  el.resultCard.classList.remove("level-up-flash");
  showScreen("menu");
});

// Init
initDevLevelSelect();
refreshMenu();
