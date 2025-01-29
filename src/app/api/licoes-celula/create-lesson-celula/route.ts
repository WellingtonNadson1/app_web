// app/api/licoes-celula/create-tema-folder/route.ts
import {
  createPrismaInstance,
  disconnectPrisma,
} from '@/components/services/database/db/prisma'
import { deepEqualLesson } from '@/functions/compareObjects'
import { normalizeFolderName } from '@/functions/normalize'

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

interface FolderLessonData {
  folderName: string
  titulo: string
  TemaLicaoCelula: { folderName: string }
  versiculo_chave: string
  licao_lancando_redes: boolean | null
  data_inicio: string | Date
  data_termino: string | Date
  link_objeto_aws?: string
}

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const temaLicaoCelulaId = formData.get('temaLicaoCelulaId') as string
    const titulo = formData.get('titulo') as string
    const versiculo_chave = formData.get('versiculo_chave') as string
    const licao_lancando_redes = formData.get('licao_lancando_redes') === 'true'
    const pdfFile = formData.get('pdfFile[]') as File
    const bucketName = 'licoes-celula-ibb-23'
    const bucketRegion = 'sa-east-1'

    if (!titulo) {
      return NextResponse.json(
        { message: 'Folder name is required' },
        { status: 400 },
      )
    }
    if (!pdfFile || pdfFile === null) {
      return NextResponse.json(
        { message: 'PDF of lesson is required' },
        { status: 400 },
      )
    }

    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    const tema = await prisma?.temaLicaoCelula.findUnique({
      where: {
        id: temaLicaoCelulaId,
      },
      select: {
        id: true,
        folderName: true,
      },
    })

    if (!tema?.folderName) {
      throw new Error('Folder Name is null')
    }

    const folderKeyNormalize = normalizeFolderName(tema?.folderName)
    const folderName = folderKeyNormalize.endsWith('/')
      ? folderKeyNormalize
      : `${folderKeyNormalize}/`

    const pdfFileNameNormalize = normalizeFolderName(pdfFile.name)
    const folderKey = `${folderName}${uuidv4()}_${pdfFileNameNormalize.replace(/\/$/, '')}`

    console.log('folderKey', folderKey)

    if (pdfFile) {
      // para que seja possivel o envio do pdfFile preciso primeiro converte-lo pro formato apropriado
      const arrayBuffer = await pdfFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const pdfParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || bucketName,
        Key: folderKey, // Nome único para o PDF
        Body: buffer, // Converte o arquivo para ArrayBuffer
        ContentType: pdfFile.type, // Define o tipo de conteúdo como PDF
      }
      const command = new PutObjectCommand(pdfParams)
      await s3.send(command)
    }

    // Gera o link do folder pa poder salvar no DB
    const linkObjetoAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderKey}`

    //Salvar o link do folder no DB
    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    await prisma?.licaoCelula.create({
      data: {
        titulo: titulo,
        temaLicaoCelulaId: temaLicaoCelulaId,
        versiculo_chave: versiculo_chave,
        licao_lancando_redes: licao_lancando_redes,
        link_objeto_aws: linkObjetoAWS,
        data_inicio: new Date(formData.get('date[from]') as string),
        data_termino: new Date(formData.get('date[to]') as string),
      },
    })

    return NextResponse.json(
      { message: `Licao '${titulo}' created successfully!` },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error creating folder:', error)
    return NextResponse.json(
      { message: 'Error creating folder' },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    // Obtenção dos parâmetros da URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    console.log('id licao', id)

    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 })
    }

    const allLicoes = await prisma?.licaoCelula.findMany({
      where: {
        temaLicaoCelulaId: id,
      },
      select: {
        id: true,
        titulo: true,
        licao_lancando_redes: true,
        versiculo_chave: true,
        link_objeto_aws: true,
        data_inicio: true,
        data_termino: true,
      },
    })
    await disconnectPrisma()

    console.log('allLicoes', allLicoes)

    return NextResponse.json(allLicoes, { status: 200 })
  } catch (error) {
    await disconnectPrisma()
    console.log('Error get lessons: ', error)

    return NextResponse.json({ message: 'Error get lessons' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const bucketName = 'licoes-celula-ibb-23'
  const bucketRegion = 'sa-east-1'
  const formData = await request.formData()
  const id = formData.get('id') as string
  const pdfFile = formData.get('pdfFile[]') as File

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 })
  }

  if (!pdfFile) {
    return NextResponse.json(
      { message: 'pdfFile is required' },
      { status: 400 },
    )
  }

  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    try {
      const getFolderNameLicao = await prisma?.licaoCelula.findUnique({
        where: {
          id: id,
        },
        select: {
          titulo: true,
          TemaLicaoCelula: {
            select: {
              folderName: true,
            },
          },
          licao_lancando_redes: true,
          link_objeto_aws: true,
          versiculo_chave: true,
          data_inicio: true,
          data_termino: true,
        },
      })

      if (!getFolderNameLicao) {
        throw new Error('Licao not found.')
      }
      // Validação de valores nulos
      if (
        !getFolderNameLicao.titulo ||
        !getFolderNameLicao.versiculo_chave ||
        !getFolderNameLicao.TemaLicaoCelula?.folderName ||
        !getFolderNameLicao.TemaLicaoCelula ||
        !getFolderNameLicao.link_objeto_aws
      ) {
        throw new Error('Some required fields are null')
      }

      const currentDataObject: FolderLessonData = {
        titulo: getFolderNameLicao.titulo,
        folderName: getFolderNameLicao.TemaLicaoCelula.folderName ?? '', // Substituir null por string vazia
        TemaLicaoCelula: {
          folderName: getFolderNameLicao.TemaLicaoCelula.folderName ?? '', // Garante que nunca seja null
        },
        versiculo_chave: getFolderNameLicao.versiculo_chave,
        licao_lancando_redes: getFolderNameLicao.licao_lancando_redes,
        link_objeto_aws: getFolderNameLicao.link_objeto_aws!,
        data_inicio: getFolderNameLicao.data_inicio,
        data_termino: getFolderNameLicao.data_termino,
      }

      const isObjectUpdateEqual = deepEqualLesson(currentDataObject, formData)

      if (isObjectUpdateEqual) {
        return NextResponse.json(
          { message: 'Lição ATUALIZADA' },
          { status: 200 },
        )
      }

      // Verifica se o folderName termina com "/"
      const folderKeyNormalize = normalizeFolderName(
        currentDataObject?.folderName,
      )

      const pdfFileNameNormalize = normalizeFolderName(pdfFile.name)

      const folderKey = `${folderKeyNormalize}${uuidv4()}_${pdfFileNameNormalize.replace(/\/$/, '')}`

      const lastPart = getFolderNameLicao.link_objeto_aws.split('/').pop()

      const folderKeyOld = `${folderKeyNormalize}${lastPart}`

      if (pdfFile) {
        // para que seja possivel o envio do pdfFile preciso primeiro converte-lo pro formato apropriado
        const arrayBuffer = await pdfFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        const pdfParams = {
          Bucket: process.env.AWS_S3_BUCKET_NAME || bucketName,
          Key: folderKey, // Nome único para o PDF
          Body: buffer, // Converte o arquivo para ArrayBuffer
          ContentType: pdfFile.type, // Define o tipo de conteúdo como PDF
        }
        const command = new PutObjectCommand(pdfParams)
        await s3.send(command)
      }

      // DELETAR OBJETO ANTEIOR
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: folderKeyOld,
      }
      const deleteCommand = new DeleteObjectCommand(params)
      await s3.send(deleteCommand)

      // Extrair os dados do formData para fazer update no DB
      const formTitulo = formData.get('titulo') as string
      const formVersiculoChave = formData.get('versiculo_chave') as string
      const formDataInicio = new Date(formData.get('date[from]') as string)
      const formDataTermino = new Date(formData.get('date[to]') as string)
      const licao_lancando_redes =
        formData.get('licao_lancando_redes') === 'true'

      // Gera o link do folder pa poder salvar no DB
      const linkObjetoAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderKey}`

      await prisma?.licaoCelula.update({
        where: {
          id: id,
        },
        data: {
          titulo: formTitulo,
          versiculo_chave: formVersiculoChave,
          licao_lancando_redes: licao_lancando_redes,
          link_objeto_aws: linkObjetoAWS,
          data_inicio: formDataInicio,
          data_termino: formDataTermino,
        },
      })
      await disconnectPrisma()
      return NextResponse.json({ message: 'Lição ATUALIZADA' }, { status: 200 })
    } catch (error) {
      console.error('Error updating licao: ', error)
      throw new Error(`Could not update folder ${id}`)
    }
  } catch (error) {
    await disconnectPrisma()
    console.error('Error updating licao: ', error)
    return NextResponse.json(
      { message: 'Error in Update Licao', error },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('licaoCelulaId')

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 })
  }

  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    try {
      const getFolderNameLicao = await prisma?.licaoCelula.findUnique({
        where: {
          id: id,
        },
        select: {
          titulo: true,
          TemaLicaoCelula: {
            select: {
              folderName: true,
            },
          },
          licao_lancando_redes: true,
          link_objeto_aws: true,
          versiculo_chave: true,
          data_inicio: true,
          data_termino: true,
        },
      })

      if (!getFolderNameLicao) {
        throw new Error('Licao not found.')
      }
      // Validação de valores nulos
      if (
        !getFolderNameLicao.titulo ||
        !getFolderNameLicao.versiculo_chave ||
        !getFolderNameLicao.TemaLicaoCelula?.folderName ||
        !getFolderNameLicao.TemaLicaoCelula ||
        !getFolderNameLicao.link_objeto_aws
      ) {
        throw new Error('Some required fields are null')
      }

      const currentDataObject: FolderLessonData = {
        titulo: getFolderNameLicao.titulo,
        folderName: getFolderNameLicao.TemaLicaoCelula.folderName ?? '', // Substituir null por string vazia
        TemaLicaoCelula: {
          folderName: getFolderNameLicao.TemaLicaoCelula.folderName ?? '', // Garante que nunca seja null
        },
        versiculo_chave: getFolderNameLicao.versiculo_chave,
        licao_lancando_redes: getFolderNameLicao.licao_lancando_redes,
        link_objeto_aws: getFolderNameLicao.link_objeto_aws!,
        data_inicio: getFolderNameLicao.data_inicio,
        data_termino: getFolderNameLicao.data_termino,
      }

      const folderKeyNormalize = normalizeFolderName(
        currentDataObject?.folderName,
      )

      const lastPart = getFolderNameLicao.link_objeto_aws.split('/').pop()

      const folderKeyOld = `${folderKeyNormalize}${lastPart}`

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: folderKeyOld,
      }

      const command = new DeleteObjectCommand(params)
      await s3.send(command)

      console.log(`Folder ${folderKeyOld} deleted successfully.`)
    } catch (error) {
      console.error('Error deleting folder:', error)
      throw new Error(`Could not delete folder ${id}`)
    }

    await prisma?.licaoCelula.delete({
      where: {
        id: id,
      },
    })
    await disconnectPrisma()

    return NextResponse.json({ message: 'Lição DELETADA' }, { status: 200 })
  } catch (error) {
    await disconnectPrisma()
    return NextResponse.json(
      { message: 'Error delete lesson' },
      { status: 500 },
    )
  }
}
