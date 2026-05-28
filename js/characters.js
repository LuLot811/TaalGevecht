/**
 * CSS-boksers met hoofd, lichaam en handschoenen
 */

function renderBoxer({ skinId, enemyId, size = "normal", facing = "right", mystery = false }) {
  const facingClass = facing === "left" ? "boxer--left" : "boxer--right";
  const sizeClass =
    size === "mini" ? "boxer--mini" : size === "large" ? "boxer--large" : "";

  if (mystery) {
    return `
      <div class="boxer boxer--mystery ${sizeClass} ${facingClass}" aria-hidden="true">
        <div class="boxer__figure">
          <div class="boxer__head">
            <span class="boxer__mystery-mark">?</span>
          </div>
          <div class="boxer__torso boxer__torso--silhouette"></div>
          <div class="boxer__shorts boxer__shorts--silhouette"></div>
        </div>
      </div>
    `;
  }

  const themeClass = enemyId
    ? `boxer--enemy boxer--${enemyId}`
    : `boxer--player boxer--${skinId || "beginner"}`;

  const accessory = enemyId
    ? renderEnemyAccessory(enemyId)
    : renderPlayerAccessory(skinId || "beginner");

  const shirtIcon = enemyId ? "" : renderShirtIcon(skinId || "beginner");
  const cape =
    !enemyId && (skinId || "beginner") === "champion"
      ? '<div class="boxer__cape" aria-hidden="true"></div>'
      : "";

  return `
    <div class="boxer ${themeClass} ${sizeClass} ${facingClass}" aria-hidden="true">
      <div class="boxer__shadow"></div>
      <div class="boxer__figure">
        ${cape}
        <div class="boxer__head">
          ${accessory}
          <div class="boxer__face">
            <span class="boxer__eye boxer__eye--l"></span>
            <span class="boxer__eye boxer__eye--r"></span>
            <span class="boxer__mouth"></span>
            <span class="boxer__cheek boxer__cheek--l"></span>
            <span class="boxer__cheek boxer__cheek--r"></span>
          </div>
        </div>
        <div class="boxer__torso">${shirtIcon}</div>
        <div class="boxer__shorts"></div>
        <div class="boxer__arm boxer__arm--back">
          <div class="boxer__glove"></div>
        </div>
        <div class="boxer__arm boxer__arm--punch">
          <div class="boxer__glove"></div>
        </div>
        <div class="boxer__leg boxer__leg--l"></div>
        <div class="boxer__leg boxer__leg--r"></div>
        <div class="boxer__foot boxer__foot--l"></div>
        <div class="boxer__foot boxer__foot--r"></div>
      </div>
    </div>
  `;
}

/** Icoon op het shirt per spelers-skin (beginner = leeg) */
function renderShirtIcon(skinId) {
  const icons = {
    strong: "🏋️",
    lightning: "⚡",
    fire: "🔥",
    champion: "👑",
    legend: "🐉",
  };
  const icon = icons[skinId];
  if (!icon) return "";
  return `<span class="boxer__shirt-icon" aria-hidden="true">${icon}</span>`;
}

function renderPlayerAccessory(skinId) {
  switch (skinId) {
    case "strong":
      return '<div class="boxer__acc boxer__acc--headband"></div>';
    case "lightning":
      return '<div class="boxer__acc boxer__acc--spikes"></div>';
    case "fire":
      return '<div class="boxer__acc boxer__acc--flame"></div>';
    case "champion":
      return '<div class="boxer__acc boxer__acc--crown"></div>';
    case "legend":
      return '<div class="boxer__acc boxer__acc--horns"></div>';
    default:
      return '<div class="boxer__acc boxer__acc--cap"></div>';
  }
}

function renderEnemyAccessory(enemyId) {
  switch (enemyId) {
    case "robot":
      return '<div class="boxer__acc boxer__acc--antenna"></div>';
    case "balloon":
      return '<div class="boxer__acc boxer__acc--balloon-knot"></div>';
    case "skibidi":
      return '<div class="boxer__acc boxer__acc--toilet"></div>';
    case "cool":
      return '<div class="boxer__acc boxer__acc--shades"></div>';
    case "sigma":
      return '<div class="boxer__acc boxer__acc--stone-brow"></div>';
    case "corn":
      return '<div class="boxer__acc boxer__acc--corn-leaves"></div>';
    default:
      return "";
  }
}

function setBoxerElement(element, options) {
  if (!element) return;
  element.innerHTML = renderBoxer(options);
}

function skinIdFromFighterSkin(skin) {
  return skin.id || "beginner";
}

function enemyIdFromEnemy(enemy) {
  return enemy.id || "robot";
}

const PLAYER_ATTACK_TYPES = {
  beginner: "glove",
  strong: "power",
  lightning: "lightning",
  fire: "fire",
  champion: "crown",
  legend: "dragon",
};

const ENEMY_ATTACK_TYPES = {
  robot: "zap",
  balloon: "bubble",
  skibidi: "splash",
  cool: "beam",
  sigma: "rock",
  corn: "corn",
};

function getPlayerAttackType(skinId) {
  return PLAYER_ATTACK_TYPES[skinId] || "glove";
}

function getEnemyAttackType(enemyId) {
  return ENEMY_ATTACK_TYPES[enemyId] || "zap";
}

function getProjectileMarkup(type) {
  switch (type) {
    case "glove":
      return '<div class="attack-glove"></div>';
    case "power":
      return '<div class="attack-glove attack-glove--power"></div>';
    case "lightning":
      return `
        <div class="attack-lightning">
          <span class="attack-lightning__bolt">⚡</span>
          <span class="attack-lightning__bolt attack-lightning__bolt--2">⚡</span>
        </div>
      `;
    case "fire":
      return '<div class="attack-fire"><span class="attack-fire__core"></span></div>';
    case "crown":
      return '<div class="attack-crown">👑</div>';
    case "dragon":
      return '<div class="attack-dragon"><span class="attack-dragon__orb"></span></div>';
    case "zap":
      return '<div class="attack-zap"></div>';
    case "bubble":
      return '<div class="attack-bubble"></div>';
    case "splash":
      return '<div class="attack-splash">💦</div>';
    case "beam":
      return '<div class="attack-beam"></div>';
    case "rock":
      return '<div class="attack-rock"></div>';
    case "corn":
      return '<div class="attack-corn">🌽</div>';
    default:
      return '<div class="attack-glove"></div>';
  }
}

function getAttackPositions(fromFighter, toFighter, arena) {
  const arenaRect = arena.getBoundingClientRect();
  const fromRect = fromFighter.getBoundingClientRect();
  const toRect = toFighter.getBoundingClientRect();
  const fromEnemy = fromFighter.classList.contains("enemy-side");

  const startX =
    (fromEnemy
      ? fromRect.left + fromRect.width * 0.28
      : fromRect.left + fromRect.width * 0.72) - arenaRect.left;
  const startY = fromRect.top + fromRect.height * 0.36 - arenaRect.top;
  const endX = toRect.left + toRect.width * 0.5 - arenaRect.left;
  const endY = toRect.top + toRect.height * 0.38 - arenaRect.top;

  return { startX, startY, endX, endY };
}

/**
 * Lanceert een karakter-specifiek projectiel door de arena
 */
function launchAttack({ type, fromFighter, toFighter, arena, delay = 90 }) {
  if (!fromFighter || !toFighter || !arena) return;

  const run = () => {
    const { startX, startY, endX, endY } = getAttackPositions(
      fromFighter,
      toFighter,
      arena
    );

    const projectile = document.createElement("div");
    const toRight = endX >= startX;
    projectile.className = `attack-projectile attack-projectile--${type} ${
      toRight ? "attack-projectile--to-right" : "attack-projectile--to-left"
    }`;
    projectile.setAttribute("aria-hidden", "true");
    projectile.innerHTML = getProjectileMarkup(type);

    projectile.style.transform = `translate(${startX}px, ${startY}px) translate(-50%, -50%)`;
    arena.appendChild(projectile);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        projectile.style.transition =
          "transform 0.4s cubic-bezier(0.15, 0.85, 0.35, 1)";
        projectile.style.transform = `translate(${endX}px, ${endY}px) translate(-50%, -50%)`;
      });
    });

    setTimeout(() => {
      projectile.classList.add("attack-projectile--impact");
      spawnImpactFlash(arena, endX, endY, type);
    }, 400);

    setTimeout(() => projectile.remove(), 520);
  };

  if (delay > 0) {
    setTimeout(run, delay);
  } else {
    run();
  }
}

function spawnImpactFlash(arena, x, y, type) {
  const flash = document.createElement("div");
  flash.className = `attack-impact attack-impact--${type}`;
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;
  flash.setAttribute("aria-hidden", "true");
  arena.appendChild(flash);
  setTimeout(() => flash.remove(), 350);
}
