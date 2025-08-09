import { prisma } from '@/lib/prisma'
import { requireRole } from '@/lib/rbac'
import { Role } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function GET() {
  const user = await requireRole([Role.ADMIN, Role.STAFF, Role.CLIENT])
  const client = await prisma.client.findFirst({ where: { userId: user.id }, include: { paymentMethods: true } })
  return NextResponse.json(client?.paymentMethods || [])
}

export async function POST(req: Request) {
  const user = await requireRole([Role.ADMIN, Role.STAFF, Role.CLIENT])
  const data = await req.json()
  const client = await prisma.client.findFirst({ where: { userId: user.id } })
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  const { name, cardNumber, expMonth, expYear } = data
  const last4 = cardNumber.slice(-4)
  const pm = await prisma.paymentMethod.create({
    data: { name, last4, expMonth, expYear, clientId: client.id },
  })
  return NextResponse.json(pm)
}