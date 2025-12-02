# Architecture Overview

## Current State: Two Separate Implementations

### 1. `src/index.ts` - Original Command-Line Solver

**Purpose**: Node.js command-line tool that solves Wordle with hardcoded constraints

**How it works**:
```typescript
// Hardcoded constraints
const ACCEPTED_CHARS: string[] = 'cth'.split('')  // Must contain these
const DENIED_CHARS: string[] = 'raneslo'.split('') // Cannot contain these
const knownCharacterRejectedPositions = {
  1: 'c',
  4: 't',
  5: 'h',
}

// Process:
1. Generate all possible 5-letter combinations
2. Filter by accepted/denied characters
3. Filter by position constraints
4. Use SpellChecker (hunspell) to validate words
5. Print results to console
```

**Key Features**:
- Uses `hunspell-spellchecker` with dictionary files (`en_EN.aff`, `en_EN.dic`)
- Hardcoded constraints (not interactive)
- Runs as a Node.js script
- Generates all combinations then filters

**Usage**: `npm run build && node src/index.js`

---

### 2. React App - Interactive Browser Solver

**Purpose**: Interactive web UI where you play Wordle and get suggestions

**How it works**:
```typescript
// In WordleGame.tsx (line 25-31):
useEffect(() => {
  const wordsArray = Array.isArray(validWords) ? validWords : []
  const solverInstance = new WordleSolver(wordsArray)  // Uses WordleSolver class
  setSolver(solverInstance)
  setSuggestions(solverInstance.getSuggestions())
}, [])

// When user marks letters (line 65-78):
const updateGuessState = useCallback((rowIndex, letterIndex, newState) => {
  const newGuesses = [...guesses]
  newGuesses[rowIndex].states[letterIndex] = newState
  setGuesses(newGuesses)
  
  if (solver) {
    solver.updateConstraints(newGuesses)  // Updates constraints dynamically
    setSuggestions(solver.getSuggestions())  // Gets new suggestions
  }
}, [guesses, solver])
```

**Key Features**:
- Uses `WordleSolver` class from `src/services/wordleSolver.ts`
- Uses `valid-words.json` (pre-filtered word list)
- **Dynamic constraints** - learns from user input (grey/yellow/green)
- Interactive UI - type directly in cells, mark letters
- Real-time suggestions update as you play

**Usage**: `npm run dev:react`

---

## Key Differences

| Feature | `index.ts` | React App |
|---------|-----------|-----------|
| **Environment** | Node.js (server-side) | Browser (client-side) |
| **Word Source** | SpellChecker (hunspell) | `valid-words.json` |
| **Constraints** | Hardcoded in code | Dynamic (from user input) |
| **Interface** | Command-line output | Interactive web UI |
| **Word Generation** | Generates all combinations | Filters existing word list |
| **Dependencies** | `hunspell-spellchecker`, `fs`, `path` | React, Vite |

---

## Data Flow in React App

```
User Types Word
    ↓
WordleCell (input field)
    ↓
WordleGame.handleCellInput()
    ↓
currentGuess state updated
    ↓
User presses Enter
    ↓
WordleGame.handleSubmitGuess()
    ↓
Guess added to guesses array
    ↓
User clicks cells to mark (grey/yellow/green)
    ↓
WordleGame.updateGuessState()
    ↓
WordleSolver.updateConstraints(guesses)
    ↓
WordleSolver.getSuggestions()
    ↓
Suggestions component displays results
```

---

## Why They're Separate

1. **`index.ts`** uses Node.js filesystem APIs (`fs`, `path`) which don't work in browsers
2. **`index.ts`** uses `hunspell-spellchecker` which may not work in browsers
3. **React app** needs to work entirely in the browser
4. **React app** uses a pre-filtered JSON word list for better performance

---

## Potential Integration

If you want to use the spellchecker logic from `index.ts` in the React app, you would need to:

1. **Create an API endpoint** that runs the spellchecker server-side
2. **Or** use a browser-compatible spellchecker library
3. **Or** pre-process all words and store in `valid-words.json` (current approach)

The current approach (using `valid-words.json`) is actually more efficient for a browser app since:
- No need for dictionary files
- Faster filtering (just array operations)
- Smaller bundle size
- Works offline


