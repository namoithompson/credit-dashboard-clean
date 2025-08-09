import pdfParse from 'pdf-parse'

export type ExtractionResult = {
  bureau?: string
  score?: number
  metadata: Record<string, any>
}

/**
 * Extract a credit bureau score from a PDF. Supports scores in the range 0–1200.
 * Uses simple regex heuristics and fallback inference based on Australian ranges
 * (Equifax/Illion/Experian). Returns the bureau and score if found.
 */
export async function extractScoreFromPdf(buffer: Buffer): Promise<ExtractionResult> {
  const data = await pdfParse(buffer)
  const text = data.text
  // Regex to find numbers 3–4 digits long that could be scores
  const numberMatches = text.match(/\b(\d{2,4})\b/g) || []
  let score: number | undefined
  for (const match of numberMatches) {
    const value = parseInt(match, 10)
    if (value >= 0 && value <= 1200) {
      // Pick the first plausible score
      score = value
      break
    }
  }
  // Detect bureau keywords
  const lowered = text.toLowerCase()
  let bureau: string | undefined
  if (lowered.includes('equifax')) {
    bureau = 'Equifax'
  } else if (lowered.includes('illion')) {
    bureau = 'Illion'
  } else if (lowered.includes('experian')) {
    bureau = 'Experian'
  }
  // Infer bureau from score range if not found explicitly
  if (!bureau && score !== undefined) {
    if (score >= 0 && score <= 1200) {
      // Use rough AU score ranges to guess
      if (score <= 700) bureau = 'Equifax'
      else if (score <= 900) bureau = 'Illion'
      else bureau = 'Experian'
    }
  }
  return { bureau, score, metadata: { textLength: text.length } }
}