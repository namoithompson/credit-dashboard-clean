import { describe, it, expect } from 'vitest'
import { extractScoreFromPdf } from '@/lib/extractor'

describe('extractScoreFromPdf', () => {
  it('infers bureau from score range when not explicitly present', async () => {
    // Simulate simple PDF text
    const sample = Buffer.from('Your credit score is 1100')
    const result = await extractScoreFromPdf(sample)
    expect(result.score).toBe(1100)
    expect(result.bureau).toBeDefined()
  })
})