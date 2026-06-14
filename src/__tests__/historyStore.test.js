import { describe, it, expect, beforeEach } from 'vitest'
import { getHistory, addEntry, clearHistory } from '../utils/historyStore'

beforeEach(() => {
  localStorage.clear()
})

const sampleSummary = (overrides = {}) => ({
  processor: 'Intel i5 / Ryzen 5',
  ram: '12 GB',
  gpu: 'Intel Iris Xe',
  budget: 'medium',
  ...overrides,
})

describe('historyStore', () => {
  it('returns an empty array when there is no history', () => {
    expect(getHistory()).toEqual([])
  })

  it('stores an entry with summary, encoded answers, id and timestamp', () => {
    addEntry({ encodedAnswers: 'abc123', summary: sampleSummary() })
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0]).toMatchObject({
      encodedAnswers: 'abc123',
      summary: sampleSummary(),
    })
    expect(history[0].id).toBeTruthy()
    expect(history[0].timestamp).toBeTruthy()
  })

  it('returns entries newest-first', () => {
    addEntry({ encodedAnswers: 'one', summary: sampleSummary({ ram: '8 GB' }) })
    addEntry({ encodedAnswers: 'two', summary: sampleSummary({ ram: '16 GB' }) })
    const history = getHistory()
    expect(history[0].encodedAnswers).toBe('two')
    expect(history[1].encodedAnswers).toBe('one')
  })

  it('caps history at 3 entries, evicting the oldest', () => {
    addEntry({ encodedAnswers: 'a', summary: sampleSummary() })
    addEntry({ encodedAnswers: 'b', summary: sampleSummary() })
    addEntry({ encodedAnswers: 'c', summary: sampleSummary() })
    addEntry({ encodedAnswers: 'd', summary: sampleSummary() })
    const history = getHistory()
    expect(history).toHaveLength(3)
    expect(history.map(e => e.encodedAnswers)).toEqual(['d', 'c', 'b'])
  })

  it('deduplicates entries with the same encoded answers', () => {
    addEntry({ encodedAnswers: 'same', summary: sampleSummary({ ram: '8 GB' }) })
    addEntry({ encodedAnswers: 'same', summary: sampleSummary({ ram: '16 GB' }) })
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0].summary.ram).toBe('16 GB')
  })

  it('is a no-op when no summary is provided', () => {
    addEntry({ encodedAnswers: 'x' })
    expect(getHistory()).toEqual([])
  })

  it('clears all history', () => {
    addEntry({ encodedAnswers: 'a', summary: sampleSummary() })
    clearHistory()
    expect(getHistory()).toEqual([])
  })

  it('ignores malformed stored data', () => {
    localStorage.setItem('csh_quiz_history', 'not-json')
    expect(getHistory()).toEqual([])
  })

  it('filters out entries missing a summary', () => {
    localStorage.setItem('csh_quiz_history', JSON.stringify([{ id: '1' }, { id: '2', summary: sampleSummary() }]))
    expect(getHistory()).toHaveLength(1)
  })
})
