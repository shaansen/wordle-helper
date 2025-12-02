# How React Generates Wordle Suggestions

## Complete Flow Diagram

```
User Clicks Cell to Mark Letter
    ↓
WordleGame.updateGuessState() [line 65-78]
    ↓
solver.updateConstraints(guesses) [line 73]
    ↓
WordleSolver.updateConstraints() [line 23-106]
    ├─> Resets all constraint sets
    ├─> Processes each guess word
    ├─> Builds constraint sets:
    │   ├─> acceptedChars (must be in word)
    │   ├─> deniedChars (cannot be in word)
    │   ├─> knownPositions (green letters)
    │   ├─> rejectedPositions (can't be here)
    │   └─> yellowChars (yellow positions)
    ↓
solver.getSuggestions() [line 74]
    ↓
WordleSolver.getSuggestions() [line 153-158]
    ├─> Filters allWords array
    ├─> Checks each word with matchesConstraints()
    └─> Returns top 50 matches
    ↓
Suggestions Component Displays Results
```

---

## Step-by-Step: How Constraints Are Built

### Example: User guesses "CRANE" and marks it

**Guess**: C R A N E  
**States**: 🟨 🟨 ⬛ ⬛ ⬛ (yellow, yellow, grey, grey, grey)

### Step 1: First Pass - Count Greens and Yellows

```typescript
// Line 32-44: First pass through the word
const greenChars = new Map()  // Count green instances
const yellowChars = new Map() // Count yellow instances

For "CRANE" with states [yellow, yellow, grey, grey, grey]:
- C at position 0: yellow → yellowChars['c'] = 1
- R at position 1: yellow → yellowChars['r'] = 1
- A at position 2: grey → skip
- N at position 3: grey → skip
- E at position 4: grey → skip

Result:
  greenChars = {}
  yellowChars = { 'c': 1, 'r': 1 }
```

### Step 2: Second Pass - Build Constraints

```typescript
// Line 47-104: Process each letter based on its state

Position 0: C = yellow
  → acceptedChars.add('c')           // C must be in word
  → rejectedPositions[0].add('c')    // C cannot be at position 0
  → yellowChars['c'].add(0)          // Track that C can't be at pos 0

Position 1: R = yellow
  → acceptedChars.add('r')           // R must be in word
  → rejectedPositions[1].add('r')    // R cannot be at position 1
  → yellowChars['r'].add(1)          // Track that R can't be at pos 1

Position 2: A = grey
  → Check: Does A appear as green/yellow? No
  → deniedChars.add('a')             // A is not in the word

Position 3: N = grey
  → Check: Does N appear as green/yellow? No
  → deniedChars.add('n')             // N is not in the word

Position 4: E = grey
  → Check: Does E appear as green/yellow? No
  → deniedChars.add('e')              // E is not in the word
```

### Step 3: Constraint Sets After This Guess

```typescript
acceptedChars = Set { 'c', 'r' }        // Must contain C and R
deniedChars = Set { 'a', 'n', 'e' }  // Cannot contain A, N, E
knownPositions = Map {}               // No green letters yet
rejectedPositions = Map {
  0: Set { 'c' },                     // Position 0 cannot be C
  1: Set { 'r' }                      // Position 1 cannot be R
}
yellowChars = Map {
  'c': Set { 0 },                     // C exists, but not at position 0
  'r': Set { 1 }                      // R exists, but not at position 1
}
```

---

## Step-by-Step: How Words Are Filtered

### Example: Checking if "CRISP" matches constraints

```typescript
// WordleSolver.matchesConstraints('crisp') [line 108-151]

Step 1: Check deniedChars [line 110-114]
  deniedChars = { 'a', 'n', 'e' }
  'crisp'.includes('a')? No ✓
  'crisp'.includes('n')? No ✓
  'crisp'.includes('e')? No ✓
  → PASS

Step 2: Check acceptedChars [line 117-121]
  acceptedChars = { 'c', 'r' }
  'crisp'.includes('c')? Yes ✓
  'crisp'.includes('r')? Yes ✓
  → PASS

Step 3: Check knownPositions [line 124-128]
  knownPositions = {} (empty, no greens yet)
  → PASS

Step 4: Check rejectedPositions [line 131-135]
  rejectedPositions = {
    0: { 'c' },  // Position 0 cannot be C
    1: { 'r' }   // Position 1 cannot be R
  }
  'crisp'[0] = 'c' → rejectedPositions[0].has('c')? Yes ✗
  → FAIL (C is at position 0, but it can't be there)

Result: "crisp" is REJECTED
```

### Example: Checking if "CRISP" → "SCRIP" matches

```typescript
// matchesConstraints('scrip')

Step 1: deniedChars
  'scrip' doesn't contain 'a', 'n', 'e' → PASS

Step 2: acceptedChars
  'scrip'.includes('c')? Yes ✓
  'scrip'.includes('r')? Yes ✓
  → PASS

Step 3: knownPositions
  (empty) → PASS

Step 4: rejectedPositions
  'scrip'[0] = 's' → rejectedPositions[0].has('s')? No ✓
  'scrip'[1] = 'c' → rejectedPositions[1].has('c')? No ✓
  → PASS

Step 5: Check yellowChars [line 138-148]
  yellowChars = {
    'c': { 0 },  // C can't be at position 0
    'r': { 1 }   // R can't be at position 1
  }
  'scrip'.includes('c')? Yes ✓
  'scrip'[0] = 's' (not 'c') → OK ✓
  'scrip'.includes('r')? Yes ✓
  'scrip'[1] = 'c' (not 'r') → OK ✓
  → PASS

Result: "scrip" is ACCEPTED ✓
```

---

## Real Example: Multiple Guesses

### Guess 1: "CRANE" → 🟨 🟨 ⬛ ⬛ ⬛

**Constraints built:**

- Must have: C, R
- Cannot have: A, N, E
- C cannot be at position 0
- R cannot be at position 1

### Guess 2: "SCRIP" → ⬛ 🟨 🟩 ⬛ ⬛

**New constraints added:**

- Must have: C, R, I (I is now required)
- Cannot have: A, N, E, S (S is now denied)
- Position 2 must be R (green)
- I cannot be at position 2
- C cannot be at positions 0 or 3

### Final Constraints:

```typescript
acceptedChars = { 'c', 'r', 'i' }
deniedChars = { 'a', 'n', 'e', 's' }
knownPositions = { 2: 'r' }  // Position 2 must be R
rejectedPositions = {
  0: { 'c', 's' },
  1: { 'r' },
  2: { 'i' },
  3: { 'c' }
}
```

### Filtering Process:

```typescript
// getSuggestions() [line 153-158]
const validWords = this.allWords.filter(word => this.matchesConstraints(word))

// For each word in valid-words.json (5,000+ words):
//   - Check if it has C, R, I
//   - Check if it doesn't have A, N, E, S
//   - Check if position 2 is R
//   - Check if C is not at positions 0 or 3
//   - Check if R is not at position 1
//   - Check if I is not at position 2

// Returns top 50 matches
```

---

## Code Locations

### Where Constraints Are Updated

- **File**: `src/components/WordleGame.tsx`
- **Function**: `updateGuessState()` [line 65-78]
- **Called when**: User clicks a cell to mark it grey/yellow/green

### Where Constraints Are Built

- **File**: `src/services/wordleSolver.ts`
- **Function**: `updateConstraints()` [line 23-106]
- **Processes**: All guesses and builds constraint sets

### Where Words Are Filtered

- **File**: `src/services/wordleSolver.ts`
- **Function**: `matchesConstraints()` [line 108-151]
- **Function**: `getSuggestions()` [line 153-158]
- **Filters**: All 5,000+ words in `valid-words.json`

### Where Suggestions Are Displayed

- **File**: `src/components/Suggestions.tsx`
- **Receives**: Array of suggested words
- **Displays**: Top 20 suggestions (or all if less than 20)

---

## Key Algorithm Details

### Grey Letter Logic (Complex Case)

When a letter is grey but appears elsewhere as yellow/green:

```typescript
// Example: Guess "APPLE" where:
//   Position 0: A = yellow
//   Position 1: P = grey
//   Position 2: P = grey
//   Position 3: L = grey
//   Position 4: E = grey

// This means:
//   - A exists in the word (yellow)
//   - P appears twice, both grey
//   - Since A is yellow, we know A exists
//   - But both P's are grey, so P doesn't exist
//   - The grey P's mean "P is not in the word at all"

// Logic in code [line 67-102]:
if (state === 'grey') {
  const greenCount = greenChars.get(char) || 0
  const yellowCount = yellowChars.get(char) || 0
  const totalAcceptedCount = greenCount + yellowCount

  if (totalAcceptedCount === 0) {
    // No green/yellow instances → completely denied
    this.deniedChars.add(char)
  } else {
    // Has green/yellow → this position is rejected
    this.rejectedPositions.get(i).add(char)
  }
}
```

### Yellow Letter Logic

```typescript
// Yellow means: "Letter exists, but not in this position"
if (state === 'yellow') {
  this.acceptedChars.add(char) // Must be in word
  this.rejectedPositions[i].add(char) // Can't be at position i
  this.yellowChars[char].add(i) // Track rejected position
}
```

### Green Letter Logic

```typescript
// Green means: "Letter is correct in this exact position"
if (state === 'green') {
  this.acceptedChars.add(char) // Must be in word
  this.knownPositions.set(i, char) // Must be at position i
}
```

---

## Performance

- **Initial load**: Filters ~5,000 words instantly
- **After each guess**: Re-filters all words (very fast, <10ms)
- **Constraint updates**: O(n) where n = number of guesses × 5 letters
- **Word filtering**: O(m) where m = number of words in dictionary

The filtering is fast because:

1. Using Sets and Maps for O(1) lookups
2. Early returns in `matchesConstraints()` when a word fails
3. Pre-filtered word list (only 5-letter words)

