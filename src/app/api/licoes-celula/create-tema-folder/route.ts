// app/api/licoes-celula/create-tema-folder/route.ts
import { deepEqual } from "@/functions/compareObjects";
import { createPrismaInstance, disconnectPrisma } from "@/services/database/db/prisma";
import { CopyObjectCommand, DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from 'next/server';

interface FolderData {
  tema: string;
  folderName: string;
  link_folder_aws: string;
  data_inicio: Date;
  data_termino: Date;
}

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const folderName = formData.get("folderName") as string
    const tema = formData.get("tema") as string
    const bucketName = "licoes-celula-ibb-23"
    const bucketRegion = "sa-east-1"


    if (!folderName) {
      return NextResponse.json({ message: "Folder name is required" }, { status: 400 });
    }

    const folderKey = folderName.endsWith('/') ? folderName : `${folderName}/`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || bucketName,
      Key: folderKey,
      Body: '', // O conteúdo do objeto para criar a "pasta"
    };

    const command = new PutObjectCommand(params);
    const result = await s3.send(command);

    // Gera o link do folder pa poder salvar no DB
    const linkFolderAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderName}/`;
    console.log('linkFolderAWS: ', linkFolderAWS)

    //Salvar o link do folder no DB
    const prisma = createPrismaInstance();

    if (!prisma) {
      throw new Error("Prisma instance is null");
    }

    const resultCreateTema = await prisma?.temaLicaoCelula.create({
      data: {
        tema: tema,
        folderName: folderName,
        link_folder_aws: linkFolderAWS,
        data_inicio: new Date(formData.get('date[from]') as string),
        data_termino: new Date(formData.get('date[to]') as string)
      }
    })

    console.log('resultCreateTema', resultCreateTema)

    return NextResponse.json({ message: `Folder '${tema}' created successfully!` }, { status: 200 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ message: 'Error creating folder' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const prisma = createPrismaInstance();

    if (!prisma) {
      throw new Error("Prisma instance is null");
    }

    const allTema = await prisma?.temaLicaoCelula.findMany({
      select: {
        id: true,
        tema: true,
        data_inicio: true,
        data_termino: true,
      }
    })
    await disconnectPrisma();

    return NextResponse.json(allTema, { status: 200 });
  } catch (error) {
    await disconnectPrisma();

    return NextResponse.json({ message: 'Error get theme lesson' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const bucketName = "licoes-celula-ibb-23"
  const bucketRegion = "sa-east-1"

  const formData = await request.formData();
  const id = formData.get("id") as string

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const prisma = createPrismaInstance();

    if (!prisma) {
      throw new Error("Prisma instance is null");
    }

    try {
      const getFolderNameTema = await prisma?.temaLicaoCelula.findUnique({
        where: {
          id: id
        },
        select: {
          folderName: true,
          tema: true,
          data_inicio: true,
          data_termino: true,
          link_folder_aws: true
        }
      })

      if (!getFolderNameTema || !getFolderNameTema.folderName) {
        throw new Error("Folder name not found.");
      }

      // Validação de valores nulos
      if (
        !getFolderNameTema.folderName ||
        !getFolderNameTema.tema ||
        !getFolderNameTema.link_folder_aws
      ) {
        throw new Error("Some required fields are null");
      }

      // Extrair os dados do formData para comparação
      const folderName = formData.get('folderName') as string;

      const currentDataObject: FolderData = {
        tema: getFolderNameTema.tema,
        folderName: getFolderNameTema.folderName,
        link_folder_aws: getFolderNameTema.link_folder_aws,
        data_inicio: getFolderNameTema.data_inicio,
        data_termino: getFolderNameTema.data_termino,
      };

      const isObjectUpdateEqual = deepEqual(currentDataObject, formData)

      if (isObjectUpdateEqual) {
        return NextResponse.json({ message: "Tema de Licão ATUALIZADO" }, { status: 200 });
      }

      // Verifica se o folderName termina com "/"
      const folderNameFormated = folderName.endsWith("/")
        ? folderName
        : `${folderName}/`;

      // Verifica se o folderName old termina com "/"
      const folderNameOld = currentDataObject.folderName.endsWith("/")
        ? currentDataObject.folderName
        : `${currentDataObject.folderName}/`;

      const copyParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${folderNameOld}`,
        Key: folderNameFormated
      }

      const copyCommand = new CopyObjectCommand(copyParams)
      await s3.send(copyCommand)

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: folderNameOld
      }

      const deleteCommand = new DeleteObjectCommand(params)
      await s3.send(deleteCommand)

      console.log(`Folder ${folderName} update successfully.`);
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw new Error(`Could not update folder ${id}`);
    }

    // Extrair os dados do formData para comparação
    const formTema = formData.get('tema') as string;
    const formFolderName = formData.get('folderName') as string;
    const formDataInicio = new Date(formData.get('date[from]') as string);
    const formDataTermino = new Date(formData.get('date[to]') as string);

    // Gera o link do folder pa poder salvar no DB
    const linkFolderAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${formFolderName}/`;

    const result = await prisma?.temaLicaoCelula.update({
      where: {
        id: id,
      },
      data: {
        tema: formTema,
        folderName: formFolderName,
        link_folder_aws: linkFolderAWS,
        data_inicio: formDataInicio,
        data_termino: formDataTermino,
      }
    });

    await disconnectPrisma();
    return NextResponse.json({ message: "Tema de Licão ATUALIZADO" }, { status: 200 });

  } catch (error) {
    await disconnectPrisma();
    return NextResponse.json({ message: 'Error in Update Tema' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("temaLicaoCelulaId")

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const prisma = createPrismaInstance();

    if (!prisma) {
      throw new Error("Prisma instance is null");
    }

    try {
      const getFolderNameTema = await prisma?.temaLicaoCelula.findUnique({
        where: {
          id: id
        },
        select: {
          folderName: true
        }
      })

      if (!getFolderNameTema || !getFolderNameTema.folderName) {
        throw new Error("Folder name not found.");
      }

      console.log('getFolderNameTema', getFolderNameTema.folderName)

      // Verifica se o folderName termina com "/"
      const folderName = getFolderNameTema.folderName.endsWith("/")
        ? getFolderNameTema.folderName
        : `${getFolderNameTema.folderName}/`;

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: folderName
      }

      console.log('folderName', folderName)
      console.log('params', params)

      const command = new DeleteObjectCommand(params)
      await s3.send(command)

      console.log(`Folder ${folderName} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw new Error(`Could not delete folder ${id}`);
    }

    const result = await prisma?.temaLicaoCelula.delete({
      where: {
        id: id,
      },
    });
    await disconnectPrisma();

    return NextResponse.json({ message: "Tema de Licão DELETADO" }, { status: 200 });
  } catch (error) {
    await disconnectPrisma();
    return NextResponse.json({ message: 'Error get theme lesson' }, { status: 500 });
  }
}
