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
      await navigator.clipboard.writeText(word)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 1000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-6 text-center">
        Suggestions
      </h2>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
          <p className="mt-4 text-gray-600 font-medium">Finding words...</p>
        </div>
      )}

      {error && (
        <div className="p-5 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 mb-4 backdrop-blur-sm">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && suggestions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">
            Enter your guesses and mark letter states to see suggestions
          </p>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {suggestions.map((word, index) => (
            <div
              key={index}
              className={`p-4 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 border-2 rounded-xl text-center text-lg font-bold uppercase cursor-pointer transition-all duration-200 active:scale-95 min-h-[52px] flex items-center justify-center backdrop-blur-sm ${
                copiedIndex === index
                  ? 'bg-gradient-to-br from-green-400 to-green-500 text-white border-green-600 shadow-lg scale-105'
                  : 'hover:from-blue-200 hover:via-purple-200 hover:to-pink-200 hover:shadow-lg hover:scale-105 border-purple-200'
              }`}
              onClick={() => copyToClipboard(word, index)}
              onTouchEnd={e => {
                e.preventDefault()
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
