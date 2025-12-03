# Wordle Solver

A command-line Wordle solver and REST API built with TypeScript that helps you find valid words based on game constraints.

## Features

- **Constraint-Based Solving**: Configure accepted/denied letters and position constraints
- **Dictionary Validation**: Uses Hunspell spellchecker to validate words
- **REST API**: HTTP endpoints for programmatic access
- **Type-Safe**: Full TypeScript implementation with proper interfaces
- **Easy Configuration**: CLI mode - edit constraints in `src/index.ts` and run

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

### REST API (Recommended)

Start the API server:

```bash
# Development mode (with auto-reload)
npm run dev:api

# Production mode
npm run start:api
```

The server will start on `http://localhost:3000` (or the port specified in `PORT` environment variable).

#### API Endpoints

##### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Wordle Solver API is running"
}
```

##### `POST /api/solve`
Solve Wordle with constraints provided in the request body.

**Request Body:**
```json
{
  "acceptedChars": ["c", "a", "t"],
  "deniedChars": ["r", "n", "e", "s", "l", "o", "h", "y"],
  "knownPositions": {
    "1": "c",
    "2": "a",
    "4": "t"
  },
  "rejectedPositions": {
    "3": ["a"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "words": ["unbid", "undid", "unfix"],
  "constraints": {
    "acceptedChars": ["c", "a", "t"],
    "deniedChars": ["r", "n", "e", "s", "l", "o", "h", "y"],
    "knownPositions": { "1": "c", "2": "a", "4": "t" },
    "rejectedPositions": { "3": ["a"] }
  }
}
```

##### `GET /api/solve`
Alternative endpoint using query parameters.

**Query Parameters:**
- `acceptedChars`: Comma-separated letters (e.g., `c,a,t`)
- `deniedChars`: Comma-separated letters (e.g., `r,n,e`)
- `knownPositions`: JSON string (e.g., `{"1":"c","2":"a"}`)
- `rejectedPositions`: JSON string (e.g., `{"3":["a"]}`)

**Example:**
```
GET /api/solve?acceptedChars=c,a,t&deniedChars=r,n,e&knownPositions={"1":"c","2":"a"}&rejectedPositions={"3":["a"]}
```

#### Example API Usage

**Using cURL:**
```bash
curl -X POST http://localhost:3000/api/solve \
  -H "Content-Type: application/json" \
  -d '{
    "acceptedChars": ["c", "a", "t"],
    "deniedChars": ["r", "n", "e"],
    "knownPositions": {"1": "c", "2": "a"},
    "rejectedPositions": {"3": ["a"]}
  }'
```

**Using JavaScript/TypeScript:**
```typescript
const response = await fetch('http://localhost:3000/api/solve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    acceptedChars: ['c', 'a', 't'],
    deniedChars: ['r', 'n', 'e'],
    knownPositions: { 1: 'c', 2: 'a' },
    rejectedPositions: { 3: ['a'] }
  })
})

const result = await response.json()
console.log(result.words) // ['unbid', 'undid', 'unfix']
```

### Command Line Interface

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
  ├── index.ts              # CLI entry point with configuration
  ├── server.ts              # REST API server
  ├── services/
  │   └── spellcheckService.ts  # Dictionary and word generation logic
  ├── utils/
  │   └── wordConstraints.ts    # Constraint validation functions
  ├── en_EN.aff             # Dictionary affix file
  └── en_EN.dic             # Dictionary word list
```

## API Error Handling

The API returns appropriate HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request body or parameters
- `404 Not Found`: Endpoint does not exist
- `500 Internal Server Error`: Server error during processing

Error responses follow this format:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## License

This project is licensed under MIT License with non-commercial use restrictions. See [LICENSE](./LICENSE) for details.

**Note**: WORDLE is a registered trademark of The New York Times Company. This solver is not affiliated with, endorsed by, or sponsored by The New York Times Company.
