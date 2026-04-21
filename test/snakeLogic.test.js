import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createInitialState,
  setDirection,
  step,
  randomFreeCell,
} from '../snakeLogic.js';

test('snake moves one cell in current direction', () => {
  const state = createInitialState(10, 10);
  const next = step(state);

  assert.deepEqual(next.snake[0], {
    x: state.snake[0].x + 1,
    y: state.snake[0].y,
  });
});

test('snake grows and score increments when food is eaten', () => {
  const state = createInitialState(10, 10);
  const forcedFood = { x: state.snake[0].x + 1, y: state.snake[0].y };

  const next = step({ ...state, food: forcedFood }, () => 0);

  assert.equal(next.score, 1);
  assert.equal(next.snake.length, state.snake.length + 1);
});

test('collision with wall sets game over', () => {
  const state = {
    ...createInitialState(4, 4),
    snake: [{ x: 3, y: 1 }],
    direction: 'right',
    queuedDirection: 'right',
  };

  const next = step(state);
  assert.equal(next.gameOver, true);
});

test('cannot reverse direction instantly', () => {
  const state = createInitialState(10, 10);
  const next = setDirection(state, 'left');
  assert.equal(next.queuedDirection, 'right');
});

test('randomFreeCell returns null when board is full', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
  ];

  const cell = randomFreeCell(2, 2, snake, () => 0);
  assert.equal(cell, null);
});
