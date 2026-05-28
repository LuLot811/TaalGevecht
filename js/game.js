/**
 * Engels Boks — Brain Rot Boxing
 * Boksgevechten met Engelse leervragen (NL UI)
 */

const STORAGE_KEY = "engelsBoksSave";

const CONFIG = {
  xpWin: 35,
  xpLoss: 15,
};

const MEDALS = [
  {
    id: "streak5",
    icon: "🎯",
    title: "Rake klappen",
    description: "5 antwoorden achter elkaar goed",
  },
  {
    id: "perfectBattle",
    icon: "🧠",
    title: "Perfect gevecht",
    description: "Alle vragen in 1 gevecht goed",
  },
  {
    id: "winStreak3",
    icon: "🔥",
    title: "Win streak",
    description: "3 gevechten achter elkaar winnen",
  },
  {
    id: "perfectWinStreak3",
    icon: "👑",
    title: "Onverslaanbaar",
    description: "3 perfecte overwinningen achter elkaar",
  },
];

function defaultMedalsState() {
  return MEDALS.reduce((acc, medal) => {
    acc[medal.id] = false;
    return acc;
  }, {});
}

const defaultSave = () => ({
  xp: 0,
  wins: 0,
  losses: 0,
  answerStreak: 0,
  winStreak: 0,
  perfectWinStreak: 0,
  medals: defaultMedalsState(),
});

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...defaultSave(),
        ...parsed,
        medals: {
          ...defaultMedalsState(),
          ...(parsed?.medals || {}),
        },
      };
    }
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
  medalsGrid: document.getElementById("medals-grid"),
  unlockTrackFill: document.getElementById("unlock-track-fill"),
  unlockNodes: document.getElementById("unlock-nodes"),
  unlockNext: document.getElementById("unlock-next"),
  devLevelSelect: document.getElementById("dev-level-select"),
  devResetMedalsBtn: document.getElementById("dev-reset-medals-btn"),
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
  battleTop: document.querySelector(".battle-top"),
  questionType: document.getElementById("question-type"),
  questionPanel: document.getElementById("question-panel"),
  questionText: document.getElementById("question-text"),
  questionReviewOverlay: document.getElementById("question-review-overlay"),
  questionReviewClose: document.getElementById("question-review-close"),
  questionReviewQuestion: document.getElementById("question-review-question"),
  questionReviewUserAnswer: document.getElementById("question-review-user-answer"),
  questionReviewCorrectAnswer: document.getElementById("question-review-correct-answer"),
  questionReviewOk: document.getElementById("question-review-ok"),
  battleHistory: document.getElementById("battle-history"),
  battleHistoryToggle: document.getElementById("battle-history-toggle"),
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
  resultMedals: document.getElementById("result-medals"),
  resultMedalsList: document.getElementById("result-medals-list"),
  btnContinue: document.getElementById("btn-continue"),
  arena: document.querySelector(".arena"),
};

let save = loadSave();
let battle = null;
let currentQuestion = null;
let inputLocked = false;

function isMobileViewport() {
  return window.matchMedia("(max-width: 768px)").matches;
}

function setBattleHistoryCollapsed(collapsed) {
  if (!el.battleHistory || !el.battleHistoryToggle) return;

  const shouldCollapse = isMobileViewport() ? collapsed : false;
  el.battleHistory.classList.toggle("battle-history--mobile-collapsed", shouldCollapse);
  el.battleHistoryToggle.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
  el.battleHistoryToggle.textContent = shouldCollapse
    ? "Toon geschiedenis"
    : "Verberg geschiedenis";
}

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
  renderMedals();
  syncDevLevelSelect();
}

function unlockMedal(id) {
  if (!save.medals || save.medals[id]) return false;
  save.medals[id] = true;
  if (battle && Array.isArray(battle.newlyUnlockedMedals)) {
    battle.newlyUnlockedMedals.push(id);
  }
  return true;
}

function getMedalById(id) {
  return MEDALS.find((medal) => medal.id === id) || null;
}

function renderMedals() {
  if (!el.medalsGrid) return;

  el.medalsGrid.innerHTML = MEDALS.map((medal) => {
    const unlocked = Boolean(save.medals?.[medal.id]);
    return `
      <article class="medal-card ${unlocked ? "medal-card--unlocked" : "medal-card--locked"}" aria-label="${medal.title}">
        <span class="medal-icon" aria-hidden="true">${medal.icon}</span>
        <h3 class="medal-title">${medal.title}</h3>
        <p class="medal-desc">${medal.description}</p>
        <span class="medal-status">${unlocked ? "Vrijgespeeld" : "Vergrendeld"}</span>
      </article>
    `;
  }).join("");
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

function resetMedalsForTesting() {
  save.medals = defaultMedalsState();
  save.answerStreak = 0;
  save.winStreak = 0;
  save.perfectWinStreak = 0;
  writeSave(save);
  renderResultMedalUnlocks([], false);
  refreshMenu();
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
    perfectBattle: true,
    newlyUnlockedMedals: [],
    history: [],
  };

  clearBattleHistory();
  setBattleHistoryCollapsed(true);
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

  currentQuestion = generateQuestion(battle.playerLevel, battle.round);
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
  focusBattleTopOnMobile();

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
  save.answerStreak += 1;
  if (save.answerStreak >= 5) {
    unlockMedal("streak5");
  }
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
  battle.perfectBattle = false;
  save.answerStreak = 0;
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

function focusBattleTopOnMobile() {
  if (!isMobileViewport()) return;
  if (!screens.battle.classList.contains("active")) return;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  const target = el.battleTop || screens.battle;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const hadPerfectBattle = Boolean(battle?.perfectBattle);

  if (won) {
    save.xp += CONFIG.xpWin;
    save.wins += 1;
    save.winStreak += 1;
    if (hadPerfectBattle) {
      save.perfectWinStreak += 1;
      unlockMedal("perfectBattle");
    } else {
      save.perfectWinStreak = 0;
    }

    if (save.winStreak >= 3) {
      unlockMedal("winStreak3");
    }
    if (save.perfectWinStreak >= 3) {
      unlockMedal("perfectWinStreak3");
    }
  } else {
    save.xp = Math.max(0, save.xp - CONFIG.xpLoss);
    save.losses += 1;
    save.winStreak = 0;
    save.perfectWinStreak = 0;
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

  const unlockedThisBattle = Array.isArray(battle?.newlyUnlockedMedals)
    ? [...battle.newlyUnlockedMedals]
    : [];
  renderResultMedalUnlocks(unlockedThisBattle, won);

  battle = null;
  currentQuestion = null;
  hideWrongAnswerOverlay();
  refreshMenu();
  showScreen("result");
}

function renderResultMedalUnlocks(unlockedMedalIds, won) {
  if (!el.resultMedals || !el.resultMedalsList) return;

  if (!won || !unlockedMedalIds.length) {
    el.resultMedals.classList.remove("result-medals--visible");
    el.resultMedalsList.innerHTML = "";
    clearResultConfetti();
    return;
  }

  const medalEntries = unlockedMedalIds
    .map((id) => getMedalById(id))
    .filter(Boolean)
    .map((medal, index) => `
      <article class="result-medal-chip" style="animation-delay: ${(index * 0.08).toFixed(2)}s">
        <span class="result-medal-chip__icon" aria-hidden="true">${medal.icon}</span>
        <span class="result-medal-chip__label">${medal.title}</span>
      </article>
    `);

  if (!medalEntries.length) {
    el.resultMedals.classList.remove("result-medals--visible");
    el.resultMedalsList.innerHTML = "";
    clearResultConfetti();
    return;
  }

  el.resultMedals.classList.add("result-medals--visible");
  el.resultMedalsList.innerHTML = medalEntries.join("");
  triggerResultConfetti();
}

function clearResultConfetti() {
  if (!el.resultCard) return;
  el.resultCard.querySelectorAll(".result-confetti").forEach((piece) => piece.remove());
}

function triggerResultConfetti() {
  if (!el.resultCard) return;
  clearResultConfetti();

  const colors = ["#ffe600", "#ff2d95", "#00f5ff", "#39ff14", "#ff9a00"];
  const pieces = 28;

  for (let i = 0; i < pieces; i++) {
    const piece = document.createElement("span");
    const drift = Math.round((Math.random() - 0.5) * 180);
    const delay = Math.random() * 0.18;
    const duration = 0.8 + Math.random() * 0.8;
    const rotate = Math.round((Math.random() - 0.5) * 360);
    const size = 6 + Math.floor(Math.random() * 7);

    piece.className = "result-confetti";
    piece.style.left = `${8 + Math.random() * 84}%`;
    piece.style.top = "-6%";
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.55}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--confetti-drift", `${drift}px`);
    piece.style.animationDelay = `${delay}s`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.transform = `rotate(${rotate}deg)`;
    el.resultCard.appendChild(piece);

    const ttlMs = Math.ceil((delay + duration) * 1000 + 120);
    setTimeout(() => piece.remove(), ttlMs);
  }
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

if (el.battleHistoryToggle) {
  el.battleHistoryToggle.addEventListener("click", () => {
    const isCollapsed = el.battleHistory.classList.contains("battle-history--mobile-collapsed");
    setBattleHistoryCollapsed(!isCollapsed);
  });
}

window.addEventListener("resize", () => {
  if (!el.battleHistory || !el.battleHistoryToggle) return;
  const isCollapsed = el.battleHistory.classList.contains("battle-history--mobile-collapsed");
  setBattleHistoryCollapsed(isCollapsed);
});

el.btnContinue.addEventListener("click", () => {
  el.resultCard.classList.remove("level-up-flash");
  if (el.resultMedals) {
    el.resultMedals.classList.remove("result-medals--visible");
  }
  if (el.resultMedalsList) {
    el.resultMedalsList.innerHTML = "";
  }
  clearResultConfetti();
  showScreen("menu");
});

if (el.devResetMedalsBtn) {
  el.devResetMedalsBtn.addEventListener("click", resetMedalsForTesting);
}

// Init
initDevLevelSelect();
refreshMenu();
