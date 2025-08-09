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
  let text: string
  try {
    const data = await pdfParse(buffer)
    text = data.text
  } catch (err) {
    // If pdf-parse fails (e.g. when passed plain text in tests), fall back to
    // interpreting the buffer as UTF‑8 text. This makes unit tests easier to
    // write without requiring a valid PDF.
    text = buffer.toString('utf8')
  }
  // Trim whitespace to normalise scanning
  const normalised = text.replace(/\s+/g, ' ')
  // First look for an explicit “credit score” anchor followed by a number.
  const anchorRegex = /credit\s+score[^0-9]{0,10}(\d{2,4})/i
  let anchorMatch = anchorRegex.exec(normalised)
  let score: number | undefined
  if (anchorMatch) {
    const value = parseInt(anchorMatch[1], 10)
    if (value >= 0 && value <= 1200) {
      score = value
    }
  }
  // If no anchor match found, search for any 2–4 digit numbers in the range
  if (score === undefined) {
    const numberMatches = normalised.match(/\b(\d{2,4})\b/g) || []
    for (const match of numberMatches) {
      const value = parseInt(match, 10)
      if (value >= 0 && value <= 1200) {
        score = value
        break
      }
    }
  }
  // Detect bureau keywords
  const lowered = normalised.toLowerCase()
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
      // Use rough Australian score ranges to guess: lower scores map to Equifax,
      // medium scores to Illion, and high scores to Experian. These ranges are
      // approximate and may be refined later.
      if (score <= 700) bureau = 'Equifax'
      else if (score <= 900) bureau = 'Illion'
      else bureau = 'Experian'
    }
  }
  return { bureau, score, metadata: { textLength: normalised.length } }
}