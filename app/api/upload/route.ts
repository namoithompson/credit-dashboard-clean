import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/rbac'
import { Role } from '@prisma/client'
import { saveFile } from '@/lib/storage'
import { extractScoreFromPdf } from '@/lib/extractor'

export async function POST(req: Request) {
  // Ensure the user is logged in. All roles may upload, but clients are
  // restricted to uploading documents for their own client record.
  const user = await requireRole([Role.ADMIN, Role.STAFF, Role.CLIENT])
  const form = await req.formData()
  const file = form.get('file') as File | null
  const clientId = form.get('clientId') as string | null
  const type = form.get('type') as string | null
  if (!file || !clientId) {
    return NextResponse.json({ error: 'Missing file or clientId' }, { status: 400 })
  }
  // If the user is a client, verify they are only uploading for their own client record
  if (user.role === Role.CLIENT) {
    const client = await prisma.client.findFirst({ where: { id: clientId, userId: user.id } })
    if (!client) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const filePath = await saveFile(`${Date.now()}-${file.name}`, buffer)
  // Create a document record
  const doc = await prisma.document.create({
    data: {
      clientId,
      type: type || 'CREDIT_FILE',
      filename: file.name,
      path: filePath,
    },
  })
  // Extract the credit score from the PDF and update the client’s bureau scores
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
  // Persist extraction metadata on the document for auditing
  await prisma.document.update({
    where: { id: doc.id },
    data: { bureau: bureau || null, metadata: metadata || {} },
  })
  return NextResponse.json({ documentId: doc.id, bureau, score })
}