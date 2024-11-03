import {
  createPrismaInstance,
  disconnectPrisma,
} from '@/components/services/database/db/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    const temaMonth = await prisma?.temaLicaoCelula.findMany({
      where: {
        status: true,
      },
      select: {
        status: true,
        id: true,
        tema: true,
        versiculo_chave: true,
        data_inicio: true,
        data_termino: true,
      },
    })
    console.log('temaMonth', temaMonth)
    await disconnectPrisma()

    return NextResponse.json(temaMonth, { status: 200 })
  } catch (error) {
    await disconnectPrisma()

    return NextResponse.json(
      { message: 'Error get theme lesson' },
      { status: 500 },
    )
  }
}
