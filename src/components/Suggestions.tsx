import { useState } from 'react'

interface SuggestionsProps {
  suggestions: string[]
  loading: boolean
  error: string | null
}

export default function Suggestions({
  suggestions,
  loading,
  error,
}: SuggestionsProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (word: string, index: number) => {
    try {
      // Use modern Clipboard API with fallback for older browsers
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(word)
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = word
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (err) {
          console.error('Fallback copy failed:', err)
        }
        document.body.removeChild(textArea)
      }
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="heading-secondary">Suggestions</h2>

      {loading && (
        <div className="text-center py-12">
          <div className="spinner"></div>
          <p className="mt-4 text-indigo-700 font-medium">Finding words...</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <div className="text-center py-12 text-indigo-600/70">
          <p className="text-lg font-medium">
            Enter your guesses and mark letter states to see suggestions
          </p>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {suggestions.map((word, index) => (
            <div
              key={index}
              className={`card-suggestion ${
                copiedIndex === index ? 'state-copied' : 'suggestion-default'
              }`}
              onClick={() => copyToClipboard(word, index)}
              onTouchStart={e => {
                // Prevent double-tap zoom on iOS
                e.preventDefault()
              }}
              onTouchEnd={e => {
                e.preventDefault()
                e.stopPropagation()
                copyToClipboard(word, index)
              }}
            >
              {copiedIndex === index ? '✓ Copied!' : word}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
