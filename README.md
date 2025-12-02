# Wordle Solver

A command-line Wordle solver built with TypeScript that helps you find valid words based on game constraints.

## Features

- **Constraint-Based Solving**: Configure accepted/denied letters and position constraints
- **Dictionary Validation**: Uses Hunspell spellchecker to validate words
- **Type-Safe**: Full TypeScript implementation with proper interfaces
- **Easy Configuration**: Simply edit the constraints in `src/index.ts` and run

## How It Works

The solver generates all possible 5-letter combinations from allowed characters, then filters them through multiple constraint checks:

1. **Accepted Characters**: Word must contain all required letters
2. **Denied Characters**: Word cannot contain excluded letters
3. **Known Positions**: Letters in specific positions (green tiles)
4. **Rejected Positions**: Letters that can't be in specific positions (yellow/grey tiles)
5. **Dictionary Validation**: Final check against English dictionary

## Requirements

- Node.js
- TypeScript
- Dictionary files (`en_EN.aff` and `en_EN.dic`) in the `src` directory

## Installation

```bash
npm install
```

## Usage

1. **Configure your Wordle constraints** in `src/index.ts`:

```typescript
// Letters that must be in the word
const ACCEPTED_CHARS: string[] = 'cat'.split('')

// Letters that are not in the word
const DENIED_CHARS: string[] = 'rneslohy'.split('')

// Known letter positions (1-indexed)
const knownCharacterPositions: Record<number, string> = {
  1: 'c', // First letter is 'c'
  2: 'a', // Second letter is 'a'
  4: 't', // Fourth letter is 't'
}

// Letters that cannot be in specific positions
const knownCharacterRejectedPositions: Record<number, string[]> = {
  3: ['a'], // 'a' cannot be in position 3
}
```

2. **Run the solver**:

```bash
# Development mode (with auto-reload)
npm run dev

# Or build and run
npm run build
node src/index.js
```

## Example Output

```
Generating word combinations...

Found 3 valid words:
  → unbid
  → undid
  → unfix
```

## Project Structure

```
src/
  ├── index.ts              # Main entry point with configuration
  ├── services/
  │   └── spellcheckService.ts  # Dictionary and word generation logic
  ├── utils/
  │   └── wordConstraints.ts    # Constraint validation functions
  ├── en_EN.aff             # Dictionary affix file
  └── en_EN.dic             # Dictionary word list
```

## License

This project is licensed under MIT License with non-commercial use restrictions. See [LICENSE](./LICENSE) for details.

**Note**: WORDLE is a registered trademark of The New York Times Company. This solver is not affiliated with, endorsed by, or sponsored by The New York Times Company.
