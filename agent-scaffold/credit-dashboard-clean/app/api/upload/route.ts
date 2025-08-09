import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/rbac'
import { Role } from '@prisma/client'
import { saveFile } from '@/lib/storage'
import { extractScoreFromPdf } from '@/lib/extractor'

export async function POST(req: Request) {
  const user = await requireRole([Role.ADMIN, Role.STAFF, Role.CLIENT])
  const form = await req.formData()
  const file = form.get('file') as File | null
  const clientId = form.get('clientId') as string | null
  const type = form.get('type') as string | null
  if (!file || !clientId) {
    return NextResponse.json({ error: 'Missing file or clientId' }, { status: 400 })
  }
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const filePath = await saveFile(`${Date.now()}-${file.name}`, buffer)
  // Create document
  const doc = await prisma.document.create({
    data: {
      clientId,
      type: type || 'CREDIT_FILE',
      filename: file.name,
      path: filePath,
    },
  })
  // Extract score and update BureauScore
  const { bureau, score, metadata } = await extractScoreFromPdf(buffer)
  if (bureau && score !== undefined) {
    await prisma.bureauScore.upsert({
      where: {
        clientId_bureau: {
          clientId,
          bureau,
        },
      },
      update: { score, scoreDate: new Date(), sourceDocumentId: doc.id },
      create: {
        clientId,
        bureau,
        score,
        scoreDate: new Date(),
        sourceDocumentId: doc.id,
      },
    })
  }
  // Save extraction metadata on document
  await prisma.document.update({ where: { id: doc.id }, data: { bureau: bureau || null, metadata: metadata || {} } })
  return NextResponse.json({ documentId: doc.id, bureau, score })
}