# Code Flow: React App vs index.ts

## React App Flow (Current Implementation)

### Initialization
```
src/main.tsx
  └─> App.tsx
       └─> WordleGame.tsx
            └─> useEffect() [line 25-31]
                 ├─> Imports: validWords from '../valid-words.json'
                 ├─> Creates: new WordleSolver(wordsArray)
                 └─> Sets: suggestions = solver.getSuggestions()
```

### User Interaction Flow
```
User types in WordleCell
  │
  ├─> WordleCell.tsx [line 58-63]
  │    └─> onChange event
  │         └─> onCellInput(cellIndex, value)
  │
  ├─> WordleGame.tsx [line 33-40]
  │    └─> handleCellInput()
  │         └─> Updates: currentGuess state
  │
  └─> User presses Enter
       │
       ├─> WordleGame.tsx [line 42-112]
       │    └─> handleCellKeyDown()
       │         └─> handleSubmitGuess() [line 115-136]
       │              ├─> Validates word against validWords array
       │              ├─> Creates new Guess object
       │              └─> Adds to guesses array
       │
       └─> User clicks cells to mark (grey/yellow/green)
            │
            └─> WordleGame.tsx [line 65-78]
                 └─> updateGuessState()
                      ├─> Updates guess.states array
                      ├─> solver.updateConstraints(newGuesses)
                      │    └─> WordleSolver.ts [line 23-106]
                      │         ├─> Resets all constraints
                      │         ├─> Processes each guess
                      │         ├─> Updates: acceptedChars, deniedChars
                      │         ├─> Updates: knownPositions, rejectedPositions
                      │         └─> Updates: yellowChars map
                      │
                      └─> solver.getSuggestions()
                           └─> WordleSolver.ts [line 153-158]
                                ├─> Filters allWords by matchesConstraints()
                                └─> Returns top 50 suggestions
```

### WordleSolver Class (src/services/wordleSolver.ts)

```typescript
class WordleSolver {
  // State (updated dynamically)
  private acceptedChars: Set<string>      // Letters that must be in word
  private deniedChars: Set<string>        // Letters not in word
  private knownPositions: Map<number, string>  // Green letters
  private rejectedPositions: Map<number, Set<string>>  // Can't be here
  private yellowChars: Map<string, Set<number>>  // Yellow positions
  
  // Methods
  updateConstraints(guesses: Guess[])      // Learn from user input
  matchesConstraints(word: string)       // Check if word matches
  getSuggestions(limit: number)          // Get filtered words
}
```

---

## index.ts Flow (NOT Used by React)

### Execution Flow
```
src/index.ts [line 118-171]
  │
  ├─> main() function
  │    │
  │    ├─> generateWordCombinations() [line 28-52]
  │    │    └─> Recursively generates all 5-letter combinations
  │    │         └─> Stores in allResults array
  │    │
  │    ├─> Filter: hasAllRequiredCharacters() [line 57-59]
  │    │    └─> Checks ACCEPTED_CHARS (hardcoded: 'cth')
  │    │
  │    ├─> Filter: hasCorrectKnownPositions() [line 64-74]
  │    │    └─> Checks knownCharacterPositions (hardcoded)
  │    │
  │    ├─> Filter: hasValidRejectedPositions() [line 79-94]
  │    │    └─> Checks knownCharacterRejectedPositions (hardcoded)
  │    │
  │    └─> Filter: spellchecker.check() [line 156-158]
  │         └─> initializeSpellchecker() [line 99-116]
  │              ├─> Reads en_EN.aff file
  │              ├─> Reads en_EN.dic file
  │              └─> Uses hunspell-spellchecker
  │
  └─> Prints results to console
```

### Hardcoded Constraints in index.ts
```typescript
// Line 8-9: Hardcoded character constraints
const ACCEPTED_CHARS: string[] = 'cth'.split('')  // Must have c, t, h
const DENIED_CHARS: string[] = 'raneslo'.split('') // Cannot have these

// Line 15-21: Hardcoded position constraints
const knownCharacterRejectedPositions = {
  1: 'c',  // Position 1 cannot be 'c'
  4: 't',  // Position 4 cannot be 't'
  5: 'h',  // Position 5 cannot be 'h'
}
```

---

## Key Difference Summary

| Aspect | React App | index.ts |
|--------|-----------|----------|
| **Word List** | `valid-words.json` (5,000+ words) | Generated combinations + spellcheck |
| **Constraints** | Dynamic (from user clicks) | Hardcoded in code |
| **Filtering** | `WordleSolver.matchesConstraints()` | Multiple filter functions |
| **Validation** | Array lookup in JSON | SpellChecker library |
| **Execution** | Browser (client-side) | Node.js (server-side) |

---

## Why React Doesn't Use index.ts

1. **Browser Incompatibility**: 
   - `index.ts` uses `fs.readFileSync()` - doesn't work in browsers
   - `index.ts` uses `hunspell-spellchecker` - may not work in browsers

2. **Different Approaches**:
   - `index.ts`: Generate all combinations → filter
   - React: Filter existing word list → faster

3. **Different Use Cases**:
   - `index.ts`: One-time solve with fixed constraints
   - React: Interactive solving with changing constraints

---

## If You Want to Integrate Them

You could create a hybrid approach:

1. **Pre-process words** using `index.ts` logic:
   ```bash
   # Run index.ts to generate valid-words.json
   npm run build && node src/index.js > valid-words.txt
   ```

2. **Use the same filtering logic** by extracting functions from `index.ts`:
   ```typescript
   // Extract hasAllRequiredCharacters, etc. to a shared utility
   // Use in both index.ts and WordleSolver
   ```

3. **Create an API** that runs `index.ts` server-side and React calls it

But the current approach (separate implementations) is actually cleaner and more efficient for a browser app!


