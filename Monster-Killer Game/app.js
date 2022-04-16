const ATTACK_VALUE = 10;
const MONSTER_ATACK_VALUE = 16;
const STRONG_ATACK_VALUE = 20;
const HEAL_VALUE = 10;
let extraLife = 1;
let battlelog = [];

const enteredValue = prompt("Enter Maximum life please", "100");

let chosenMaxLife = parseInt(enteredValue);
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;

adjustHealthBars(chosenMaxLife);

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

function writetoLog(ev, val, monsterHealth, playerHealth) {
  let logEntry;
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "MONSTER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: ev,
        value: val,
        target: "PLAYER",
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
  }

  battlelog.push(logEntry);
}

function gameReseter() {
  extraLife += 1;
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function winCondition() {
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You Won!");
    writetoLog(
      LOG_EVENT_GAME_OVER,
      "player won!",
      currentMonsterHealth,
      currentPlayerHealth
    );
    gameReseter();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("You Lose!");
    writetoLog(
      LOG_EVENT_GAME_OVER,
      "You Lose!",
      currentMonsterHealth,
      currentPlayerHealth
    );
    gameReseter();
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("Draw!");
    writetoLog(
      LOG_EVENT_GAME_OVER,
      "Draw!",
      currentMonsterHealth,
      currentPlayerHealth
    );
    gameReseter();
  }
}

function bonusLife() {
  if (currentPlayerHealth <= 0 && extraLife > 0) {
    currentPlayerHealth += chosenMaxLife;
    setPlayerHealth(chosenMaxLife);
    removeBonusLife();
    extraLife -= 1;
  } else {
    return;
  }
}

function monsterAttack(mode) {
  const maxDamage =
    mode === "regularAttack" ? ATTACK_VALUE : STRONG_ATACK_VALUE;
  const logWritter =
    mode === "regularAttack"
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  const monsterDamage = dealPlayerDamage(MONSTER_ATACK_VALUE);
  currentPlayerHealth -= monsterDamage;
  writetoLog(logWritter, damage, currentMonsterHealth, currentPlayerHealth);
  writetoLog(
    LOG_EVENT_MONSTER_ATTACK,
    monsterDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  bonusLife();
  winCondition();
}

function attackHandler() {
  monsterAttack("regularAttack");
}

function strongAttack() {
  monsterAttack("strongAttack");
}

function healingPlayer() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal to more than your maximum initial health");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  const monsterDamage = dealPlayerDamage(MONSTER_ATACK_VALUE);
  currentPlayerHealth += healValue;
  currentPlayerHealth -= monsterDamage;
  bonusLife();
  winCondition();
  writetoLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
}

function printLogHandler() {
  let i = 1;
  for (const logEntry of battlelog) {
    console.log(`#${i}`);
    for (const key in logEntry) {
      console.log(`${key} => ${logEntry[key]}`);
    }
    i++;
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttack);
healBtn.addEventListener("click", healingPlayer);
logBtn.addEventListener("click", printLogHandler);
