import { Request, Response } from 'express'
import * as fs from 'fs-extra'
import axios from 'axios'
import * as path from 'path'

import { File } from '../File'
import { Image } from '../Image'
import { PDF } from '../PDF'
import { Archive } from '../Archive'
import { s3Client } from '../s3Client'
import { IRecognizeDocument } from '../interface/IRecognizeDocument'
import { IFileFront } from '../interface/IFileFront'
import { IDetectedDocument } from '../interface/IDetectedDocument'
import config from '../config/environment.config'

export async function uploadFiles(req: Request, res: Response) {
  const pathToFolder = `${config.uploadFolder}/${req.body.uuid}`
  const images: Image[] = []

  for (const fileName of fs.readdirSync(pathToFolder)) {
    const file = new File(`${pathToFolder}/${fileName}`)
    const pdfs: PDF[] = []

    if (file.isImage()) {
      images.push(new Image(file))
    }

    if (file.isPDF()) {
      pdfs.push(new PDF(file))
    }

    if (file.isArchive()) {
      const archive = new Archive(file)
      await archive.open()

      const openedImages = archive.getOpenedImages()
      const openedPDFs = archive.getOpenedPDFs()

      openedImages.forEach((img: Image) => images.push(img))
      openedPDFs.forEach((pdf: PDF) => pdfs.push(pdf))
    }

    for (const pdf of pdfs) {
      await pdf.open()
      const openedImages = pdf.getOpenedImages()

      openedImages.forEach((img: Image) => images.push(img))
    }
  }

  for (const image of images) {
    await image.pushToS3(config.s3UploadPath + req.body.uuid + '/')
  }

  await fs.remove(config.s3UploadPath + req.body.uuid)

  let detectedDocuments: IDetectedDocument[] = []

  try {
    const detectedDocumentsResponse = await axios.post(
      config.objectDetectionUrl,
      {
        docs: images.map(img => img.s3path)
      }
    )

    detectedDocuments = detectedDocumentsResponse.data
  } catch (e) {
    return res.send({ message: 'Ошибка сегментации' })
  }

  let filesFront: IFileFront[] = []
  let recognizedData: IRecognizeDocument[] = []

  try {
    const recognizeResponse = await axios.post(
      config.recognizeUrl,
      {
        docs: detectedDocuments.filter(
          (doc: IDetectedDocument) =>
            doc.type === 'passport' || doc.type === 'driver-license-front'
        )
      },
      {
        headers: { Authorization: `Bearer ${config.recognizeToken}` }
      }
    )

    recognizedData = recognizeResponse.data
  } catch (e) {
    console.log('ERROR', e)
  }

  detectedDocuments.forEach((doc: IDetectedDocument) => {
    let type

    if (doc.type === 'passport' || doc.type === 'passport_back') {
      type = 'passport'
    } else if (doc.type === 'driver-license-front' || doc.type === 'dl_back') {
      type = 'driver-license-front'
    } else {
      type = 'other'
    }

    filesFront.push({
      name: path.basename(doc.crop_image_key),
      link: s3Client.generateLink(doc.crop_image_key),
      documentType: type
    })
  })

  return res.send({
    recognize: recognizedData ?? null,
    files: filesFront
  })
}
