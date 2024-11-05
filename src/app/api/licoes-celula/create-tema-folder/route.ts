// app/api/licoes-celula/create-tema-folder/route.ts
import {
  createPrismaInstance,
  disconnectPrisma,
} from '@/components/services/database/db/prisma'
import { deepEqual } from '@/functions/compareObjects'
import { normalizeFolderName } from '@/functions/normalize'
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  ObjectIdentifier,
  PutObjectCommand,
  S3Client,
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
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const folderName = formData.get('folderName') as string
    const tema = formData.get('tema') as string
    const versiculo_chave = formData.get('versiculo_chave') as string
    const bucketName = 'licoes-celula-ibb-23'
    const bucketRegion = 'sa-east-1'

    if (!folderName) {
      return NextResponse.json(
        { message: 'Folder name is required' },
        { status: 400 },
      )
    }

    const folderKeyNormalize = normalizeFolderName(folderName)

    const folderKey = folderKeyNormalize.endsWith('/')
      ? folderKeyNormalize
      : `${folderKeyNormalize}/`

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || bucketName,
      Key: folderKey,
      Body: '', // O conteúdo do objeto para criar a "pasta"
    }

    const command = new PutObjectCommand(params)
    const result = await s3.send(command)

    // Gera o link do folder pa poder salvar no DB
    const linkFolderAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderKey}`
    console.log('linkFolderAWS: ', linkFolderAWS)

    //Salvar o link do folder no DB
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    const resultCreateTema = await prisma?.temaLicaoCelula.create({
      data: {
        tema: tema,
        versiculo_chave: versiculo_chave,
        folderName: folderKeyNormalize,
        link_folder_aws: linkFolderAWS,
        data_inicio: new Date(formData.get('date[from]') as string),
        data_termino: new Date(formData.get('date[to]') as string),
      },
    })

    console.log('resultCreateTema', resultCreateTema)

    return new NextResponse(
      JSON.stringify({ message: `Folder '${tema}' created successfully!` }),
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

    const allTema = await prisma?.temaLicaoCelula.findMany({
      select: {
        status: true,
        id: true,
        tema: true,
        versiculo_chave: true,
        data_inicio: true,
        data_termino: true,
      },
    })
    await disconnectPrisma()

    return new NextResponse(JSON.stringify(allTema), {
      status: 200,
      headers: { 'Cache-Control': 'no-store' }, // Evita cache
    });

  } catch (error) {
    await disconnectPrisma()

    return NextResponse.json(
      { message: 'Error get theme lesson' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  const bucketName = 'licoes-celula-ibb-23'
  const bucketRegion = 'sa-east-1'

  const formData = await request.formData()
  console.log('formData', formData)
  const id = formData.get('id') as string

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 })
  }

  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    try {
      const getFolderNameTema = await prisma?.temaLicaoCelula.findUnique({
        where: {
          id: id,
        },
        select: {
          folderName: true,
          tema: true,
          versiculo_chave: true,
          data_inicio: true,
          data_termino: true,
          link_folder_aws: true,
        },
      })

      if (!getFolderNameTema || !getFolderNameTema.folderName) {
        throw new Error('Folder name not found.')
      }

      console.log('getFolderNameTema', getFolderNameTema)

      // Validação de valores nulos
      if (
        !getFolderNameTema.folderName ||
        !getFolderNameTema.tema ||
        !getFolderNameTema.versiculo_chave ||
        !getFolderNameTema.link_folder_aws
      ) {
        throw new Error('Some required fields are null')
      }

      // Extrair os dados do formData para comparação
      const folderName = formData.get('folderName') as string

      const currentDataObject: FolderData = {
        tema: getFolderNameTema.tema,
        versiculo_chave: getFolderNameTema.versiculo_chave,
        folderName: getFolderNameTema.folderName,
        link_folder_aws: getFolderNameTema.link_folder_aws,
        data_inicio: getFolderNameTema.data_inicio,
        data_termino: getFolderNameTema.data_termino,
      }

      const isObjectUpdateEqual = deepEqual(currentDataObject, formData)

      console.log('isObjectUpdateEqual: ', isObjectUpdateEqual)

      if (isObjectUpdateEqual) {
        return new NextResponse(
          JSON.stringify({ message: `Tema de Lição ATUALIZADO!` }),
          {
            status: 200,
            headers: { 'Cache-Control': 'no-store' }, // Evita cache
          }
        );
      }

      // Verifica se o folderName termina com "/"
      const folderKeyNormalize = normalizeFolderName(folderName)

      const folderKey = folderKeyNormalize.endsWith('/')
        ? folderKeyNormalize
        : `${folderKeyNormalize}/`

      // Verifica se o folderName old termina com "/"
      const folderNameOld = currentDataObject.folderName.endsWith('/')
        ? currentDataObject.folderName
        : `${currentDataObject.folderName}/`

      console.log('folderNameFormated', folderKey)
      console.log('folderNameOld', folderNameOld)

      const copyParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${folderNameOld}`,
        Key: folderKey,
      }

      const copyCommand = new CopyObjectCommand(copyParams)
      const resultCopy = await s3.send(copyCommand)

      console.log('resultCopy', resultCopy)

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: folderNameOld,
      }

      const deleteCommand = new DeleteObjectCommand(params)
      const resulDelete = await s3.send(deleteCommand)

      console.log('resulDelete', resulDelete)

      console.log(`Folder ${folderName} update successfully.`)
    } catch (error) {
      console.error('Error deleting folder:', error)
      throw new Error(`Could not update folder ${id}`)
    }

    // Extrair os dados do formData para comparação
    const formTema = formData.get('tema') as string
    const formVersiculoChave = formData.get('versiculo_chave') as string
    const formFolderName = formData.get('folderName') as string
    const formDataInicio = new Date(formData.get('date[from]') as string)
    const formDataTermino = new Date(formData.get('date[to]') as string)

    console.log('formVersiculoChave', formVersiculoChave)

    // Gera o link do folder pa poder salvar no DB
    const folderKeyNormalize = normalizeFolderName(formFolderName)

    const folderKey = folderKeyNormalize.endsWith('/')
      ? folderKeyNormalize
      : `${folderKeyNormalize}/`

    const linkFolderAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderKey}`

    const result = await prisma?.temaLicaoCelula.update({
      where: {
        id: id,
      },
      data: {
        tema: formTema,
        versiculo_chave: formVersiculoChave,
        folderName: folderKeyNormalize,
        link_folder_aws: linkFolderAWS,
        data_inicio: formDataInicio,
        data_termino: formDataTermino,
      },
    })

    console.log('result', result)
    await disconnectPrisma()
    return new NextResponse(
      JSON.stringify({ message: `Tema de Lição ATUALIZADO!` }),
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  } catch (error) {
    await disconnectPrisma()
    return new NextResponse(
      JSON.stringify({ message: 'Error in Update Tema' }),
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
    const temaRegister = await prisma?.temaLicaoCelula.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        status: true,
        tema: true,
        versiculo_chave: true,
        folderName: true,
        data_inicio: true,
        data_termino: true,
        link_folder_aws: true,
      },
    })

    if (!temaRegister) {
      throw new Error('TEMA not found.')
    }

    console.log('temaRegister: ', temaRegister)

    const result = await prisma?.temaLicaoCelula.update({
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
      JSON.stringify({ message: `Status do Tema de Lição ATUALIZADO!` }),
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  } catch (error) {
    await disconnectPrisma()
    console.log('Error in Update Status Tema: ', error)
    return new NextResponse(
      JSON.stringify({ message: 'Error in Update Status Tema' }),
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' }, // Evita cache
      }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('temaLicaoCelulaId')

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 })
  }

  try {
    const prisma = createPrismaInstance()

    if (!prisma) {
      throw new Error('Prisma instance is null')
    }

    try {
      const getFolderNameTema = await prisma?.temaLicaoCelula.findUnique({
        where: {
          id: id,
        },
        select: {
          folderName: true,
        },
      })

      if (!getFolderNameTema || !getFolderNameTema.folderName) {
        throw new Error('Folder name not found.')
      }

      // Verifica se o folderName termina com "/"
      const folderName = getFolderNameTema.folderName.endsWith('/')
        ? getFolderNameTema.folderName
        : `${getFolderNameTema.folderName}/`

      const listParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Prefix: folderName,
      }

      const listCommand = new ListObjectsV2Command(listParams)
      const listedObjects = await s3.send(listCommand)

      const deleteParams: {
        Bucket: string
        Delete: { Objects: ObjectIdentifier[] }
      } = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Delete: { Objects: [] },
      }

      listedObjects.Contents?.forEach((content) => {
        if (content.Key) {
          deleteParams.Delete.Objects.push({ Key: content.Key })
        }
      })

      await prisma.$transaction(async (prismaTransaction) => {
        // Delecao na S3
        if (deleteParams.Delete.Objects.length > 0) {
          const deleteCommand = new DeleteObjectsCommand(deleteParams)
          await s3.send(deleteCommand)
          console.log(
            `Deleted ${deleteParams.Delete.Objects.length} objects from S3`,
          )
        } else {
          console.log('No objects to delete')
        }

        console.log(`Folder ${folderName} deleted successfully.`)

        await prismaTransaction.temaLicaoCelula.delete({
          where: { id: id },
        })
      })

      await disconnectPrisma()

      return NextResponse.json(
        { message: 'Tema de Lição DELETADO' },
        { status: 200 },
      )
    } catch (error) {
      console.error('Error deleting folder:', error)
      throw new Error(`Could not delete folder ${id}`)
    }
  } catch (error) {
    await disconnectPrisma()
    console.error('Erro ao deletar tema:', error)
    return NextResponse.json(
      { message: 'Erro ao deletar tema: ' + error },
      { status: 500 },
    )
  }
}
