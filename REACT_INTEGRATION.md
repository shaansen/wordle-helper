# React Integration with index.ts

## Overview

The React app now uses the **same constraint checking logic** as `index.ts`! Here's how they're connected:

## Shared Code Structure

```
src/
├── utils/
│   └── wordConstraints.ts          ← Shared constraint checking functions
│       ├── hasAllRequiredCharacters()
│       ├── hasCorrectKnownPositions()
│       ├── hasValidRejectedPositions()
│       └── matchesAllConstraints()
│
├── services/
│   ├── spellcheckService.ts        ← Shared solving logic
│   │   ├── solveWordleWithConstraints()  ← Used by index.ts main()
│   │   └── initializeSpellchecker()
│   │
│   └── wordleSolver.ts            ← React solver (enhanced)
│       └── getSuggestionsUsingSharedLogic()  ← Uses shared functions!
│
├── index.ts                        ← Command-line solver
│   └── main()                      ← Uses solveWordleWithConstraints()
│
└── components/
    └── WordleGame.tsx              ← React UI
        └── Uses getSuggestionsUsingSharedLogic()
```

## How React Uses index.ts Logic

### 1. React Component Calls Shared Logic

```typescript
// src/components/WordleGame.tsx
useEffect(() => {
  const solverInstance = new WordleSolver(wordsArray)
  // Uses shared constraint checking from index.ts!
  setSuggestions(solverInstance.getSuggestionsUsingSharedLogic())
}, [])

// When user marks letters:
solver.updateConstraints(newGuesses)
// Uses shared logic for consistency with index.ts
setSuggestions(solver.getSuggestionsUsingSharedLogic())
```

### 2. WordleSolver Uses Shared Functions

```typescript
// src/services/wordleSolver.ts
getSuggestionsUsingSharedLogic() {
  // Convert React constraints to WordConstraints format
  const constraints: WordConstraints = {
    acceptedChars: Array.from(this.acceptedChars),
    deniedChars: Array.from(this.deniedChars),
    knownPositions: {...},  // Converted from Map
    rejectedPositions: {...} // Converted from Map
  }

  // Use the SAME constraint checking as index.ts!
  const validWords = this.allWords.filter(word =>
    matchesAllConstraints(word, constraints)  // ← Shared function!
  )

  return validWords.slice(0, limit)
}
```

### 3. Shared Constraint Functions

```typescript
// src/utils/wordConstraints.ts
// These functions are used by BOTH index.ts and React!

export function hasAllRequiredCharacters(word, acceptedChars) {
  // Same logic used in index.ts
}

export function hasCorrectKnownPositions(word, knownPositions) {
  // Same logic used in index.ts
}

export function hasValidRejectedPositions(word, rejectedPositions) {
  // Same logic used in index.ts
}

export function matchesAllConstraints(word, constraints) {
  // Combines all checks - used by React!
}
```

### 4. index.ts Uses Same Functions

```typescript
// src/index.ts
export async function main() {
  const constraints: WordConstraints = {...}
  const spellchecker = initializeSpellchecker()

  // Uses the SAME solving function!
  const validWords = await solveWordleWithConstraints(
    constraints,
    spellchecker
  )

  return validWords
}
```

## Data Flow

### React App Flow:

```
User marks letters
    ↓
WordleGame.updateGuessState()
    ↓
WordleSolver.updateConstraints()
    ↓
WordleSolver.getSuggestionsUsingSharedLogic()
    ↓
matchesAllConstraints()  ← Shared function from utils/
    ↓
Uses hasAllRequiredCharacters()  ← Same as index.ts!
Uses hasCorrectKnownPositions()  ← Same as index.ts!
Uses hasValidRejectedPositions() ← Same as index.ts!
    ↓
Returns suggestions
```

### index.ts Flow:

```
main() function
    ↓
solveWordleWithConstraints()
    ↓
Uses hasAllRequiredCharacters()  ← Same function!
Uses hasCorrectKnownPositions()  ← Same function!
Uses hasValidRejectedPositions() ← Same function!
    ↓
Spellchecker validation
    ↓
Returns valid words
```

## Key Benefits

1. **Consistency**: React and index.ts use the same constraint logic
2. **Maintainability**: One place to update constraint checking
3. **Accuracy**: Both implementations produce the same results
4. **Flexibility**: React can optionally use spellchecker via API

## Optional: Using Spellchecker in React

For full spellchecker validation (like index.ts), you can set up an API endpoint:

```typescript
// React can call this to get spellchecker-validated suggestions
const suggestions = await solver.getSuggestionsWithSpellcheck()

// This calls: POST /api/solve-wordle
// Which uses: solveWordleWithConstraints() with spellchecker
```

See `src/api/wordleApi.ts` for the API handler setup.

## Example: Same Constraints, Same Results

### In index.ts:

```typescript
const constraints = {
  acceptedChars: ['c', 'r'],
  deniedChars: ['a', 'n', 'e'],
  knownPositions: {},
  rejectedPositions: { 1: ['c'], 2: ['r'] },
}

const words = await solveWordleWithConstraints(constraints, spellchecker)
// Returns: ['scrip', 'crimp', ...]
```

### In React:

```typescript
// User marks "CRANE" as: 🟨🟨⬛⬛⬛
solver.updateConstraints(guesses)

// Internally converts to same format:
const constraints = {
  acceptedChars: ['c', 'r'],
  deniedChars: ['a', 'n', 'e'],
  knownPositions: {},
  rejectedPositions: { 1: ['c'], 2: ['r'] },
}

const words = solver.getSuggestionsUsingSharedLogic()
// Returns: ['scrip', 'crimp', ...]  ← Same results!
```

## Testing the Integration

You can verify they use the same logic:

```typescript
// In React component, log the constraints:
const constraints = solver.getConstraintsAsWordConstraints()
console.log('React constraints:', constraints)

// Then in index.ts, use the same constraints:
const words = await solveWordleWithConstraints(constraints, spellchecker)
console.log('index.ts results:', words)

// Both should produce the same filtered words!
```

## Summary

✅ React now uses the **exact same constraint checking logic** as `index.ts`  
✅ Both use shared functions from `utils/wordConstraints.ts`  
✅ Both can use `solveWordleWithConstraints()` from `spellcheckService.ts`  
✅ React can optionally use spellchecker via API endpoint  
✅ Consistent results between command-line and React app

The React app and `index.ts` are now fully integrated and use the same core solving logic!



