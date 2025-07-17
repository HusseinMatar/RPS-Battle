let playerScore = 0;
let computerScore = 0;
let countdownTime = 3;
let countdownInterval;
let playerChoice = null;

// Image paths for player and CPU choices
const imageMap = {
  rock: 'img/rock.png',
  paper: 'img/paper.png',
  scissors: 'img/scissors.png'
};

// Start a new round
function startRound() {
  clearInterval(countdownInterval); // Prevent multiple timers

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

    // Update countdown display
    if (countdownTime > 0) {
      document.getElementById('countdown').textContent = countdownTime;
    } else {
      document.getElementById('countdown').textContent = '';
    }

    // Handle end of countdown
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

// When the player makes a choice
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

  // Show choices
  document.getElementById('computer-choice-label').textContent = `CPU chose: ${computerChoice.toUpperCase()}`;
  document.getElementById('player-img').src = imageMap[playerChoice];
  document.getElementById('cpu-img').src = imageMap[computerChoice];
  document.getElementById('battle-scene').classList.remove('hidden');

  // Determine outcome
  let outcome;
  let resultText;

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

// Update score display
function updateScores() {
  document.getElementById('player-score').textContent = playerScore;
  document.getElementById('computer-score').textContent = computerScore;
}

// Enable or disable choice buttons
function enableButtons(enable) {
  document.getElementById('rock-btn').disabled = !enable;
  document.getElementById('paper-btn').disabled = !enable;
  document.getElementById('scissors-btn').disabled = !enable;
}

// Save result to localStorage
function saveGameResult(result) {
  const history = JSON.parse(localStorage.getItem('rpsHistory')) || [];

  history.push({
    result,
    date: new Date().toISOString()
  });

  localStorage.setItem('rpsHistory', JSON.stringify(history));
}

// Load history stats on console (optional)
function loadHistoryStats() {
  const history = JSON.parse(localStorage.getItem('rpsHistory')) || [];
  const wins = history.filter(h => h.result === 'win').length;
  const losses = history.filter(h => h.result === 'lose').length;
  const draws = history.filter(h => h.result === 'draw').length;

  console.log(`📊 Stats — Played: ${history.length}, Wins: ${wins}, Losses: ${losses}, Draws: ${draws}`);
}

// Clear game history (optional)
function resetHistory() {
  localStorage.removeItem('rpsHistory');
  console.log('🧹 History cleared.');
}

// Fix mobile viewport height
function setTrueVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize on page load
window.onload = () => {
  loadHistoryStats();
};

window.addEventListener('load', setTrueVH);
window.addEventListener('resize', setTrueVH);