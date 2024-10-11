// app/api/licoes-celula/create-tema-folder/route.ts
import { createPrismaInstance, disconnectPrisma } from "@/services/database/db/prisma";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';


interface FolderData {
  titulo: string;
  versiculo_chave: string,
  folderName: string;
  link_objeto_aws: string;
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
    const folderNameId = formData.get("folderName") as string
    const titulo = formData.get("titulo") as string
    const versiculo_chave = formData.get("versiculo_chave") as string
    const pdfFile = formData.get('pdfFile') as File;

    const bucketName = "licoes-celula-ibb-23"
    const bucketRegion = "sa-east-1"


    if (!titulo) {
      return NextResponse.json({ message: "Folder name is required" }, { status: 400 });
    }

    const prisma = createPrismaInstance();

    if (!prisma) {
      throw new Error("Prisma instance is null");
    }

    const tema = await prisma?.temaLicaoCelula.findUnique({
      where: {
        id: folderNameId,
      },
      select: {
        id: true,
        folderName: true,
      },
    })

    console.log('tema', tema?.folderName)

    if (!tema?.folderName) {
      throw new Error("Folder Name is null");
    }

    const folderName = tema?.folderName.endsWith('/') ? tema?.folderName : `${tema?.folderName}/`;
    const folderKey = `${folderName}${uuidv4()}_${pdfFile.name}`;

    console.log('folderKey', folderKey)

    if (pdfFile) {
      const pdfParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME || bucketName,
        Key: folderKey, // Nome único para o PDF
        Body: pdfFile, // Converte o arquivo para ArrayBuffer
        ContentType: pdfFile.type, // Define o tipo de conteúdo como PDF
      };
      const command = new PutObjectCommand(pdfParams);
      const result = await s3.send(command);
    }


    // Gera o link do folder pa poder salvar no DB
    const linkObjetoAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${folderKey}/`;
    console.log('linkObjetoAWS: ', linkObjetoAWS)

    //Salvar o link do folder no DB
    if (!prisma) {
      throw new Error("Prisma instance is null");
    }

    const resultCreateTema = await prisma?.licaoCelula.create({
      data: {
        titulo: titulo,
        versiculo_chave: versiculo_chave,
        link_objeto_aws: linkObjetoAWS,
        data_inicio: new Date(formData.get('date[from]') as string),
        data_termino: new Date(formData.get('date[to]') as string)
      }
    })

    console.log('resultCreateTema', resultCreateTema)

    return NextResponse.json({ message: `Folder '${titulo}' created successfully!` }, { status: 200 });
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

    // Obtenção dos parâmetros da URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const allLicoes = await prisma?.licaoCelula.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        titulo: true,
        versiculo_chave: true,
        link_objeto_aws: true,
        data_inicio: true,
        data_termino: true,
      },
    })
    await disconnectPrisma();

    console.log('allLicoes', allLicoes)

    return NextResponse.json(allLicoes, { status: 200 });
  } catch (error) {
    await disconnectPrisma();
    console.log('Error get lessons: ', error)

    return NextResponse.json({ message: 'Error get lessons' }, { status: 500 });
  }
}

// export async function PUT(request: Request) {
//   const bucketName = "licoes-celula-ibb-23"
//   const bucketRegion = "sa-east-1"

//   const formData = await request.formData();
//   console.log('formData', formData)
//   const id = formData.get("id") as string

//   if (!id) {
//     return NextResponse.json({ message: "ID is required" }, { status: 400 });
//   }

//   try {
//     const prisma = createPrismaInstance();

//     if (!prisma) {
//       throw new Error("Prisma instance is null");
//     }

//     try {
//       const getFolderNameTema = await prisma?.temaLicaoCelula.findUnique({
//         where: {
//           id: id
//         },
//         select: {
//           folderName: true,
//           tema: true,
//           versiculo_chave: true,
//           data_inicio: true,
//           data_termino: true,
//           link_objeto_aws: true
//         }
//       })

//       if (!getFolderNameTema || !getFolderNameTema.folderName) {
//         throw new Error("Folder name not found.");
//       }

//       console.log('getFolderNameTema', getFolderNameTema)

//       // Validação de valores nulos
//       if (
//         !getFolderNameTema.folderName ||
//         !getFolderNameTema.tema ||
//         !getFolderNameTema.versiculo_chave ||
//         !getFolderNameTema.link_objeto_aws
//       ) {
//         throw new Error("Some required fields are null");
//       }

//       // Extrair os dados do formData para comparação
//       const folderName = formData.get('folderName') as string;

//       const currentDataObject: FolderData = {
//         tema: getFolderNameTema.tema,
//         versiculo_chave: getFolderNameTema.versiculo_chave,
//         folderName: getFolderNameTema.folderName,
//         link_objeto_aws: getFolderNameTema.link_objeto_aws,
//         data_inicio: getFolderNameTema.data_inicio,
//         data_termino: getFolderNameTema.data_termino,
//       };

//       const isObjectUpdateEqual = deepEqual(currentDataObject, formData)

//       if (isObjectUpdateEqual) {
//         return NextResponse.json({ message: "Tema de Licão ATUALIZADO" }, { status: 200 });
//       }

//       // Verifica se o folderName termina com "/"
//       const folderNameFormated = folderName.endsWith("/")
//         ? folderName
//         : `${folderName}/`;

//       // Verifica se o folderName old termina com "/"
//       const folderNameOld = currentDataObject.folderName.endsWith("/")
//         ? currentDataObject.folderName
//         : `${currentDataObject.folderName}/`;

//       const copyParams = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${folderNameOld}`,
//         Key: folderNameFormated
//       }

//       const copyCommand = new CopyObjectCommand(copyParams)
//       await s3.send(copyCommand)

//       const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: folderNameOld
//       }

//       const deleteCommand = new DeleteObjectCommand(params)
//       await s3.send(deleteCommand)

//       console.log(`Folder ${folderName} update successfully.`);
//     } catch (error) {
//       console.error("Error deleting folder:", error);
//       throw new Error(`Could not update folder ${id}`);
//     }

//     // Extrair os dados do formData para comparação
//     const formTema = formData.get('tema') as string;
//     const formVersiculoChave = formData.get('versiculo_chave') as string;
//     const formFolderName = formData.get('folderName') as string;
//     const formDataInicio = new Date(formData.get('date[from]') as string);
//     const formDataTermino = new Date(formData.get('date[to]') as string);

//     console.log('formVersiculoChave', formVersiculoChave)

//     // Gera o link do folder pa poder salvar no DB
//     const linkFolderAWS = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${formFolderName}/`;

//     const result = await prisma?.temaLicaoCelula.update({
//       where: {
//         id: id,
//       },
//       data: {
//         tema: formTema,
//         versiculo_chave: formVersiculoChave,
//         folderName: formFolderName,
//         link_objeto_aws: linkFolderAWS,
//         data_inicio: formDataInicio,
//         data_termino: formDataTermino,
//       }
//     });

//     console.log('result', result)
//     await disconnectPrisma();
//     return NextResponse.json({ message: "Tema de Licão ATUALIZADO" }, { status: 200 });

//   } catch (error) {
//     await disconnectPrisma();
//     return NextResponse.json({ message: 'Error in Update Tema' }, { status: 500 });
//   }
// }

// export async function PATCH(request: Request) {
//   const formData = await request.formData();
//   const statusDataForm = formData.get("status") === 'true'
//   const id = formData.get("id") as string
//   console.log('status FormData: ', statusDataForm)
//   console.log('id FormData: ', id)

//   if (!statusDataForm && !id) {
//     return NextResponse.json({ message: "STATUS and ID is required" }, { status: 400 });
//   }

//   const prisma = createPrismaInstance();

//   if (!prisma) {
//     throw new Error("Prisma instance is null");
//   }

//   try {
//     const temaRegister = await prisma?.temaLicaoCelula.findUnique({
//       where: {
//         id: id
//       },
//       select: {
//         id: true,
//         status: true,
//         tema: true,
//         versiculo_chave: true,
//         folderName: true,
//         data_inicio: true,
//         data_termino: true,
//         link_objeto_aws: true
//       }
//     })

//     if (!temaRegister) {
//       throw new Error("TEMA not found.");
//     }

//     console.log('temaRegister: ', temaRegister)

//     const result = await prisma?.temaLicaoCelula.update({
//       where: {
//         id: id,
//       },
//       data: {
//         status: statusDataForm
//       }
//     });

//     console.log('result Update Status: ', result)

//     await disconnectPrisma();
//     return NextResponse.json({ message: "Status do Tema de Licão ATUALIZADO" }, { status: 200 });
//   }
//   catch (error) {
//     await disconnectPrisma();
//     console.log('Error in Update Status Tema: ', error)
//     return NextResponse.json({ message: 'Error in Update Status Tema' }, { status: 500 });
//   }
// }

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url)
//   const id = searchParams.get("temaLicaoCelulaId")

//   if (!id) {
//     return NextResponse.json({ message: "ID is required" }, { status: 400 });
//   }

//   try {
//     const prisma = createPrismaInstance();

//     if (!prisma) {
//       throw new Error("Prisma instance is null");
//     }

//     try {
//       const getFolderNameTema = await prisma?.temaLicaoCelula.findUnique({
//         where: {
//           id: id
//         },
//         select: {
//           folderName: true
//         }
//       })

//       if (!getFolderNameTema || !getFolderNameTema.folderName) {
//         throw new Error("Folder name not found.");
//       }

//       console.log('getFolderNameTema', getFolderNameTema.folderName)

//       // Verifica se o folderName termina com "/"
//       const folderName = getFolderNameTema.folderName.endsWith("/")
//         ? getFolderNameTema.folderName
//         : `${getFolderNameTema.folderName}/`;

//       const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME,
//         Key: folderName
//       }

//       console.log('folderName', folderName)
//       console.log('params', params)

//       const command = new DeleteObjectCommand(params)
//       await s3.send(command)

//       console.log(`Folder ${folderName} deleted successfully.`);
//     } catch (error) {
//       console.error("Error deleting folder:", error);
//       throw new Error(`Could not delete folder ${id}`);
//     }

//     const result = await prisma?.temaLicaoCelula.delete({
//       where: {
//         id: id,
//       },
//     });
//     await disconnectPrisma();

//     return NextResponse.json({ message: "Tema de Licão DELETADO" }, { status: 200 });
//   } catch (error) {
//     await disconnectPrisma();
//     return NextResponse.json({ message: 'Error get theme lesson' }, { status: 500 });
//   }
// }
