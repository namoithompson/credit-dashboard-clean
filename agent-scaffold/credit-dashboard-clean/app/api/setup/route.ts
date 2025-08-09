import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { z } from 'zod'

const setupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1)
})

export async function POST(req: Request) {
  const count = await prisma.user.count()
  if (count > 0) {
    return NextResponse.json({ error: 'Setup already completed' }, { status: 400 })
  }
  const body = await req.json()
  const parsed = setupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { email, password, name } = parsed.data
  const user = await prisma.user.create({ data: { email, password, name, role: Role.ADMIN } })
  return NextResponse.json({ id: user.id })
}