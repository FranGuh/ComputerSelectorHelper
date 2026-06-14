/*
 * F-02: Quiz results history.
 * Stores the last few completed quiz results in localStorage so the Landing
 * page can offer quick access back to them. Pure module — no React.
 */

const STORAGE_KEY = 'csh_quiz_history'
const MAX_ENTRIES = 3

const isValidEntry = (entry) => Boolean(entry && entry.summary)

export const getHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidEntry)
  } catch {
    return []
  }
}

// Adds a completed-quiz entry. Newest-first, capped, deduped by encodedAnswers.
export const addEntry = ({ encodedAnswers = '', summary } = {}) => {
  if (!summary) return getHistory()

  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    encodedAnswers,
    summary: {
      processor: summary.processor || '',
      ram: summary.ram || '',
      gpu: summary.gpu || '',
      budget: summary.budget || '',
    },
  }

  const previous = getHistory().filter(
    (e) => !encodedAnswers || e.encodedAnswers !== encodedAnswers
  )
  const next = [entry, ...previous].slice(0, MAX_ENTRIES)

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // storage full or unavailable — keep the in-memory result
  }
  return next
}

export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
