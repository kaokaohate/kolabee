# Snake game

A minimal classic Snake implementation.

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Test

```bash
npm test
```

## Manual verification checklist

- [ ] Snake moves every tick and responds to Arrow keys + WASD.
- [ ] Snake grows and score increments after eating food.
- [ ] Wall or self collision ends the game.
- [ ] Pause/Resume works (Space key and button).
- [ ] Restart resets score and board state.
