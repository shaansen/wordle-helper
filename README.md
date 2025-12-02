# Wordle Solver

An efficient TypeScript-based Wordle solver with an interactive React UI that learns from your guesses in real-time.

## Features

- **Interactive React UI**: Play Wordle with a beautiful, modern interface
- **Real-time Learning**: Mark letters as grey, yellow, or green and the solver updates instantly
- **Smart Suggestions**: Get word suggestions based on your current constraints
- **Efficient Algorithm**: Uses constraint-based filtering to find valid solutions
- **Type Safety**: Full TypeScript implementation with proper interfaces and types
- **Modular Design**: Clean separation of concerns with a dedicated `WordleSolver` class

## How It Works

The solver uses a more efficient approach than brute force:

1. **Constraint-Based Generation**: Instead of generating all possible 5-letter combinations, it builds words character by character while checking constraints early
2. **Early Termination**: Stops building a word as soon as it can't satisfy the remaining constraints
3. **Spell Checking**: Validates generated words against a dictionary to ensure they're real words

## Usage

```typescript
const constraints: WordleConstraints = {
  acceptedChars: ['u', 'n', 'i'], // Characters that must be in the word
  deniedChars: [
    'q',
    'w',
    'e',
    'r',
    't',
    'y',
    'o',
    'p',
    'a',
    's',
    'g',
    'c',
    'v',
  ], // Characters not in the word
  knownPositions: {}, // Known character positions (1-indexed)
  rejectedPositions: {
    // Characters that can't be in specific positions
    2: ['u', 'i'],
    3: ['n', 'i'],
    5: ['n'],
  },
}

const solver = new WordleSolver(constraints, spellchecker)
const validWords = solver.findValidWords()
```

## Performance Improvements

Compared to the original implementation:

- **Memory Efficiency**: No longer stores all possible combinations in memory
- **Speed**: Early termination reduces computation by orders of magnitude
- **Readability**: Clear class structure and method names
- **Maintainability**: Better error handling and type safety

## Requirements

- Node.js
- TypeScript
- Dictionary files (`en_EN.aff` and `en_EN.dic`) in the `src` directory

## Running

### React UI (Recommended)

To run the interactive Wordle solver UI:

```bash
npm install
npm run dev:react
```

Then open your browser to `http://localhost:3000`

**How to use:**

1. Type a 5-letter word guess in the input field and press Enter
2. Click on each letter cell to cycle through states:
   - **Grey**: Letter is not in the word
   - **Yellow**: Letter is in the word but in the wrong position
   - **Green**: Letter is in the correct position
3. The suggestions panel will update automatically as you mark letters
4. Use the Reset button to start over

### Command Line Solver

To run the original command-line solver:

```bash
npm install
npm run build
node src/index.js
```

## Example Output

```
Initializing Wordle solver...
Finding valid words...

Found 3 valid words:
  → unbid
  → undid
  → unfix
```

## Deploying to GitHub Pages

This app is configured for automatic deployment to GitHub Pages!

### Quick Deploy

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Deploy Wordle Solver"
   git push origin main
   ```

2. **Enable GitHub Pages:**

   - Go to your repository → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save

3. **Automatic Deployment:**
   - GitHub Actions will automatically build and deploy
   - Check the **Actions** tab for deployment status
   - Your site will be live at: `https://yourusername.github.io/wordle/`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Live Demo

Once deployed, your Wordle Solver will be available at:

- `https://yourusername.github.io/wordle/` (if repo is named "wordle")
- Or your custom domain if configured
