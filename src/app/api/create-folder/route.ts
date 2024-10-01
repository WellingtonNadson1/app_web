// app/api/create-folder/route.ts
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const { folderName } = await request.json();
    const bucketName = "licoes-celula-ibb-23"
    const bucketRegion = "sa-east-1"

    if (!folderName) {
      return NextResponse.json({ message: "Folder name is required" }, { status: 400 });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || bucketName, // Nome do bucket
      // Adiciona uma barra no final para indicar que é um "folder"
      Key: folderName.endsWith('/') ? folderName : `${folderName}/`, // Nome do folder
      Body: '', // O conteúdo do objeto para criar a "pasta"
    };

    const command = new PutObjectCommand(params);
    const result = await s3.send(command);

    // Gera o link do folder pa poder salvar no DB
    const linkFolderAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderName}/`;
    console.log('linkFolderAWS: ', linkFolderAWS)

    return NextResponse.json({ message: `Folder '${folderName}' created successfully!` }, { status: 200 });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ message: 'Error creating folder' }, { status: 500 });
  }
}
