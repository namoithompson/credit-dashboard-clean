import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/rbac'
import { Role } from '@prisma/client'
import { z } from 'zod'

const clientSchema = z.object({
  firstName: z.string().min(1),
  middleName: z.string().optional(),
  lastName: z.string().min(1),
  dob: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  await requireRole([Role.ADMIN, Role.STAFF])
  const body = await req.json()
  const parsed = clientSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { firstName, middleName, lastName, dob, address, email, phone, password } = parsed.data
  const user = await prisma.user.create({
    data: {
      email,
      password,
      role: Role.CLIENT,
      clients: {
        create: {
          firstName,
          middleName,
          lastName,
          dob: dob ? new Date(dob) : null,
          address,
          email,
          phone,
        },
      },
    },
  })
  return NextResponse.json(user)
}