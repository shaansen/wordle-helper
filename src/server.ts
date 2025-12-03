import express, { Request, Response } from 'express'
import { solveWordle } from './utils/solver'
import { initializeSpellchecker } from './services/spellcheckService'
import {
  parseConstraintsFromBody,
  parseConstraintsFromQuery,
} from './utils/requestParser'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

let spellchecker: ReturnType<typeof initializeSpellchecker> | null = null

function getSpellchecker() {
  if (!spellchecker) {
    try {
      spellchecker = initializeSpellchecker()
      console.log('Dictionary spellchecker initialized successfully')
    } catch (error) {
      console.error('Failed to initialize spellchecker:', error)
      throw error
    }
  }
  return spellchecker
}

function handleError(error: unknown, res: Response) {
  console.error('Error solving Wordle:', error)
  res.status(500).json({
    error: 'Internal server error',
    message: error instanceof Error ? error.message : 'Unknown error occurred',
  })
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Wordle Solver API is running' })
})

app.post('/api/solve', async (req: Request, res: Response) => {
  try {
    const constraints = parseConstraintsFromBody(req.body)
    if (!constraints) {
      return res.status(400).json({
        error: 'Invalid request body',
        message: 'Request body must be a valid WordConstraints object',
      })
    }

    const checker = getSpellchecker()
    const result = await solveWordle(constraints, checker)
    res.json(result)
  } catch (error) {
    handleError(error, res)
  }
})

app.get('/api/solve', async (req: Request, res: Response) => {
  try {
    const constraints = parseConstraintsFromQuery(req.query)
    const checker = getSpellchecker()
    const result = await solveWordle(constraints, checker)
    res.json(result)
  } catch (error) {
    handleError(error, res)
  }
})

app.use(
  (err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err)
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    })
  },
)

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
  })
})

function startServer() {
  try {
    getSpellchecker()
    app.listen(PORT, () => {
      console.log(`Wordle Solver API server running on port ${PORT}`)
      console.log(`Health check: http://localhost:${PORT}/health`)
      console.log(`API endpoint: http://localhost:${PORT}/api/solve`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  startServer()
}

export { app, startServer }

