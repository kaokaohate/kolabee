import {
  createInitialState,
  keyToDirection,
  setDirection,
  step,
  togglePause,
} from './snakeLogic.js';

const GRID_SIZE = 16;
const TICK_MS = 140;

const board = document.querySelector('[data-board]');
const scoreEl = document.querySelector('[data-score]');
const statusEl = document.querySelector('[data-status]');
const restartButton = document.querySelector('[data-restart]');
const pauseButton = document.querySelector('[data-pause]');
const controls = document.querySelectorAll('[data-control]');

let state = createInitialState(GRID_SIZE, GRID_SIZE);

function render() {
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${state.width}, 1fr)`;

  for (let y = 0; y < state.height; y += 1) {
    for (let x = 0; x < state.width; x += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      if (state.food && state.food.x === x && state.food.y === y) {
        cell.classList.add('food');
      }

      const snakeIndex = state.snake.findIndex((s) => s.x === x && s.y === y);
      if (snakeIndex === 0) {
        cell.classList.add('snake-head');
      } else if (snakeIndex > 0) {
        cell.classList.add('snake-body');
      }

      board.appendChild(cell);
    }
  }

  scoreEl.textContent = `${state.score}`;

  if (state.gameOver && state.food === null) {
    statusEl.textContent = 'You win — board filled! Press Restart.';
  } else if (state.gameOver) {
    statusEl.textContent = 'Game over. Press Restart.';
  } else if (state.paused) {
    statusEl.textContent = 'Paused';
  } else {
    statusEl.textContent = 'Running';
  }

  pauseButton.textContent = state.paused ? 'Resume' : 'Pause';
}

function reset() {
  state = createInitialState(GRID_SIZE, GRID_SIZE);
  render();
}

function handleDirection(direction) {
  state = setDirection(state, direction);
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    state = togglePause(state);
    render();
    return;
  }

  const direction = keyToDirection(event.code);
  if (direction) {
    event.preventDefault();
    handleDirection(direction);
  }
});

controls.forEach((button) => {
  button.addEventListener('click', () => {
    handleDirection(button.dataset.control);
  });
});

restartButton.addEventListener('click', reset);
pauseButton.addEventListener('click', () => {
  state = togglePause(state);
  render();
});

setInterval(() => {
  state = step(state);
  render();
}, TICK_MS);

render();
