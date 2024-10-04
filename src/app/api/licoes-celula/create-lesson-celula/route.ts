// app/api/licoes-celula/create-tema-folder/route.ts
import { createPrismaInstance } from "@/services/database/db/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from 'next/server';

const s3Lessons = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POSTLESSON(request: Request) {
  try {
    const formData = await request.formData();
    console.log('formData', formData)
    const folderName = formData.get("folderName") as string
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
    const result = await s3Lessons.send(command);

    // Gera o link do folder pa poder salvar no DB
    const linkFolderAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderName}/`;
    console.log('linkFolderAWS: ', linkFolderAWS)

    //Salvar o link do folder no DB
    const prisma = createPrismaInstance();

    if (!prisma) {
      throw new Error("Prisma instance is null");
    }

    const resultCreateLessonCelula = await prisma?.licaoCelula.create({
      data: {
        titulo: folderName,
        versiculo_cahve: folderName,
        temaLicaoCelulaId: "12",
        link_objeto_aws: linkFolderAWS,
        data_inicio: new Date(formData.get('dateFrom') as string),
        data_termino: new Date(formData.get('dateTo') as string),

      }
    })

    console.log('resultCreateLessonCelula', resultCreateLessonCelula)

    return NextResponse.json({ message: `Folder '${folderName}' created successfully!` }, { status: 200 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ message: 'Error creating folder' }, { status: 500 });
  }
}
