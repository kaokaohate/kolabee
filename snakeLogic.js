const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1, name: 'up' },
  KeyW: { x: 0, y: -1, name: 'up' },
  ArrowDown: { x: 0, y: 1, name: 'down' },
  KeyS: { x: 0, y: 1, name: 'down' },
  ArrowLeft: { x: -1, y: 0, name: 'left' },
  KeyA: { x: -1, y: 0, name: 'left' },
  ArrowRight: { x: 1, y: 0, name: 'right' },
  KeyD: { x: 1, y: 0, name: 'right' },
};

const OPPOSITE = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(width = 16, height = 16) {
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  return {
    width,
    height,
    snake: [
      { x: centerX, y: centerY },
      { x: centerX - 1, y: centerY },
      { x: centerX - 2, y: centerY },
    ],
    direction: 'right',
    queuedDirection: 'right',
    food: { x: centerX + 2, y: centerY },
    score: 0,
    gameOver: false,
    paused: false,
  };
}

export function keyToDirection(code) {
  const mapping = DIRECTIONS[code];
  return mapping ? mapping.name : null;
}

export function setDirection(state, nextDirection) {
  if (!nextDirection || state.gameOver) return state;
  if (OPPOSITE[state.direction] === nextDirection) return state;

  return {
    ...state,
    queuedDirection: nextDirection,
  };
}

function nextHead(head, direction) {
  switch (direction) {
    case 'up':
      return { x: head.x, y: head.y - 1 };
    case 'down':
      return { x: head.x, y: head.y + 1 };
    case 'left':
      return { x: head.x - 1, y: head.y };
    case 'right':
      return { x: head.x + 1, y: head.y };
    default:
      return head;
  }
}

export function randomFreeCell(width, height, snake, rng = Math.random) {
  const occupied = new Set(snake.map((segment) => `${segment.x},${segment.y}`));
  const freeCells = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) freeCells.push({ x, y });
    }
  }

  if (freeCells.length === 0) return null;
  const index = Math.floor(rng() * freeCells.length);
  return freeCells[index];
}

export function step(state, rng = Math.random) {
  if (state.gameOver || state.paused) return state;

  const direction = state.queuedDirection;
  const newHead = nextHead(state.snake[0], direction);
  const hitWall =
    newHead.x < 0 ||
    newHead.x >= state.width ||
    newHead.y < 0 ||
    newHead.y >= state.height;

  if (hitWall) {
    return { ...state, direction, gameOver: true };
  }

  const eatsFood = newHead.x === state.food.x && newHead.y === state.food.y;
  const bodyWithoutTail = eatsFood ? state.snake : state.snake.slice(0, -1);
  const hitSelf = bodyWithoutTail.some(
    (segment) => segment.x === newHead.x && segment.y === newHead.y,
  );

  if (hitSelf) {
    return { ...state, direction, gameOver: true };
  }

  const grownSnake = [newHead, ...state.snake];
  const nextSnake = eatsFood ? grownSnake : grownSnake.slice(0, -1);
  const nextFood = eatsFood
    ? randomFreeCell(state.width, state.height, nextSnake, rng)
    : state.food;

  return {
    ...state,
    direction,
    snake: nextSnake,
    food: nextFood,
    score: eatsFood ? state.score + 1 : state.score,
    gameOver: nextFood === null,
  };
}

export function togglePause(state) {
  if (state.gameOver) return state;
  return { ...state, paused: !state.paused };
}
