// app/api/licoes-celula/create-tema-folder/route.ts
import {
  createPrismaInstance,
  disconnectPrisma,
} from '@/components/services/database/db/prisma'
import {
  S3Client
} from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'

interface FolderData {
  tema: string
  versiculo_chave: string
  folderName: string
  link_folder_aws: string
  data_inicio: Date
  data_termino: Date
}

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string


    if (!title) {
      return NextResponse.json(
        { message: 'Title name is required' },
        { status: 400 },
      )
    }

    //Salvar o link do folder no DB
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    const resultCreateEventoAgenda = await prisma?.agenda.create({
      data: {
        title: title,
        description: description,
        data_inicio: new Date(formData.get('date[from]') as string),
        data_termino: new Date(formData.get('date[to]') as string),
      }
    })

    console.log('resultCreateEventoAgenda', resultCreateEventoAgenda)

    return new NextResponse(
      JSON.stringify({ message: `Evento: '${title}' created successfully!` }),
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );

  } catch (error) {
    console.error('Error creating folder:', error)
    return new NextResponse(
      JSON.stringify({ message: 'Error creating folder' }),
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  }
}

export async function GET(request: Request) {
  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    // Obtenção dos parâmetros da URL
    const url = new URL(request.url)
    const take = parseInt(url.searchParams.get('take') || '10', 10) // Limitar para 10 resultados por padrão
    const skip = parseInt(url.searchParams.get('skip') || '0', 10) // Ignorar 0 registros por padrão

    console.log('Schemas disponíveis:', Object.keys(prisma));

    const allEventosAgenda = await prisma?.agenda.findMany({
      select: {
        status: true,
        id: true,
        title: true,
        description: true,
        data_inicio: true,
        data_termino: true,
      },
    })

    await disconnectPrisma()
    return new NextResponse(JSON.stringify(allEventosAgenda), {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }, // Evita cache
    });

  } catch (error) {
    console.error(error)
    await disconnectPrisma()

    return NextResponse.json(
      { message: 'Error get events in agenda' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  const formData = await request.formData()
  const id = formData.get('id') as string

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 })
  }

  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    // Extrair os dados do formData para comparação
    const formTitle = formData.get('title') as string
    const formDescription = formData.get('description') as string
    const formDataInicio = new Date(formData.get('date[from]') as string)
    const formDataTermino = new Date(formData.get('date[to]') as string)

    const result = await prisma?.agenda.update({
      where: {
        id: id,
      },
      data: {
        title: formTitle,
        description: formDescription,
        data_inicio: formDataInicio,
        data_termino: formDataTermino,
      },
    })

    console.log('result', result)
    await disconnectPrisma()
    return new NextResponse(
      JSON.stringify({ message: `Evento da Agenda ATUALIZADO!` }),
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  } catch (error) {
    await disconnectPrisma()
    return new NextResponse(
      JSON.stringify({ message: 'Error in Update Evento na Agenda.' }),
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  }
}

export async function PATCH(request: Request) {
  const formData = await request.formData()
  const statusDataForm = formData.get('status') === 'true'
  const id = formData.get('id') as string
  console.log('status FormData: ', statusDataForm)
  console.log('id FormData: ', id)

  if (!statusDataForm && !id) {
    return NextResponse.json(
      { message: 'STATUS and ID is required' },
      { status: 400 },
    )
  }

  const prisma = createPrismaInstance()

  if (!prisma) {
    throw new Error('Prisma instance is null')
  }

  try {
    const eventoAgenda = await prisma?.agenda.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        status: true,
        title: true,
        description: true,
        data_inicio: true,
        data_termino: true,
      },
    })

    if (!eventoAgenda) {
      throw new Error('Evento not found.')
    }

    console.log('eventoAgenda: ', eventoAgenda)

    const result = await prisma?.agenda.update({
      where: {
        id: id,
      },
      data: {
        status: statusDataForm,
      },
    })

    console.log('result Update Status: ', result)

    await disconnectPrisma()
    return new NextResponse(
      JSON.stringify({ message: `Status do Evento ATUALIZADO!` }),
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  } catch (error) {
    await disconnectPrisma()
    console.log('Error in Update Status Evento: ', error)
    return new NextResponse(
      JSON.stringify({ message: 'Error in Update Status Evento' }),
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('eventoAgendaId')

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 })
  }

  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    try {
      await prisma?.agenda.delete({
        where: {
          id: id,
        },
      })

      await disconnectPrisma()

      return NextResponse.json(
        { message: 'Evento da Agenda DELETADO' },
        { status: 200 },
      )
    } catch (error) {
      console.error('Error deleting Event:', error)
      throw new Error(`Could not delete Event ${id}`)
    }
  } catch (error) {
    await disconnectPrisma()
    console.error('Erro ao deletar Evento da Agenda:', error)
    return NextResponse.json(
      { message: 'Erro ao deletar Evento da Agenda: ' + error },
      { status: 500 },
    )
  }
}
