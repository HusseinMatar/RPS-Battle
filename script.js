let playerScore = 0;
let computerScore = 0;
let countdownTime = 3;
let countdownInterval;
let playerChoice = null;

// Image mapping for player and CPU choices
const imageMap = {
  rock: 'img/rock.png',
  paper: 'img/paper.png',
  scissors: 'img/scissors.png'
};

// Starts a new round
function startRound() {
  clearInterval(countdownInterval); // Prevent duplicate timers

  playerChoice = null;
  countdownTime = 3;

  // Reset UI
  document.getElementById('countdown').textContent = '3';
  document.getElementById('result').textContent = 'Choose quickly!';
  document.getElementById('player-choice-label').textContent = 'Pick your move...';
  document.getElementById('computer-choice-label').textContent = 'Waiting...';
  document.getElementById('battle-scene').classList.add('hidden');

  enableButtons(true);

  countdownInterval = setInterval(() => {
    countdownTime--;

    if (countdownTime > 0) {
      document.getElementById('countdown').textContent = countdownTime;
    } else {
      document.getElementById('countdown').textContent = ''; // Hide countdown
    }

    if (countdownTime === 0) {
      clearInterval(countdownInterval);
      enableButtons(false);

      if (playerChoice) {
        playBattle(playerChoice);
      } else {
        document.getElementById('result').textContent = "⏰ Too late! CPU wins!";
        computerScore++;
        updateScores();
        saveGameResult("lose");
      }
    }
  }, 1000);
}

// Called when player makes a choice
function makeChoice(choice) {
  if (countdownTime > 0 && !playerChoice) {
    playerChoice = choice;
    document.getElementById('player-choice-label').textContent = `You chose: ${choice.toUpperCase()}`;
  }
}

// Core game logic
function playBattle(playerChoice) {
  const choices = ['rock', 'paper', 'scissors'];
  const computerChoice = choices[Math.floor(Math.random() * choices.length)];

  // Show computer choice
  document.getElementById('computer-choice-label').textContent = `CPU chose: ${computerChoice.toUpperCase()}`;

  // Display images
  document.getElementById('player-img').src = imageMap[playerChoice];
  document.getElementById('cpu-img').src = imageMap[computerChoice];
  document.getElementById('battle-scene').classList.remove('hidden');

  let resultText = '';
  let outcome = '';

  if (playerChoice === computerChoice) {
    resultText = "⚖️ It's a draw!";
    outcome = "draw";
  } else if (
    (playerChoice === 'rock' && computerChoice === 'scissors') ||
    (playerChoice === 'paper' && computerChoice === 'rock') ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) {
    resultText = "🎉 You win this round!";
    outcome = "win";
    playerScore++;
  } else {
    resultText = "💥 CPU wins this round!";
    outcome = "lose";
    computerScore++;
  }

  document.getElementById('result').textContent = resultText;
  updateScores();
  saveGameResult(outcome);
}

// Updates score display
function updateScores() {
  document.getElementById('player-score').textContent = playerScore;
  document.getElementById('computer-score').textContent = computerScore;
}

// Enable/disable choice buttons
function enableButtons(enable) {
  document.getElementById('rock-btn').disabled = !enable;
  document.getElementById('paper-btn').disabled = !enable;
  document.getElementById('scissors-btn').disabled = !enable;
}

// Save game result to localStorage
function saveGameResult(result) {
  const history = JSON.parse(localStorage.getItem('rpsHistory')) || [];

  history.push({
    result: result, // win | lose | draw
    date: new Date().toISOString()
  });

  localStorage.setItem('rpsHistory', JSON.stringify(history));
}

// Load and display stats in console
function loadHistoryStats() {
  const history = JSON.parse(localStorage.getItem('rpsHistory')) || [];

  const wins = history.filter(h => h.result === 'win').length;
  const losses = history.filter(h => h.result === 'lose').length;
  const draws = history.filter(h => h.result === 'draw').length;

  console.log(`📊 Stats — Played: ${history.length}, Wins: ${wins}, Losses: ${losses}, Draws: ${draws}`);
}

// Clear stored game history
function resetHistory() {
  localStorage.removeItem('rpsHistory');
  console.log('🧹 History cleared.');
}

// Fix viewport height issues on mobile
function setTrueVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize on load
window.onload = function () {
  loadHistoryStats();
};

window.addEventListener('load', setTrueVH);
window.addEventListener('resize', setTrueVH);