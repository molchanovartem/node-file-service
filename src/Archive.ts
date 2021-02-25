import * as unzipper from 'unzipper'
import * as fs from 'fs'
import { createExtractorFromFile } from 'node-unrar-js'

import { File } from './File'
import { Image } from './Image'
import { PDF } from './PDF'

export class Archive extends File {
  file: File
  readonly openedFiles: File[]

  constructor(file: File) {
    super(file.path)

    this.file = file
    this.openedFiles = []
  }

  getOpenedFiles(): File[] {
    return this.openedFiles
  }

  getOpenedImages(): Image[] {
    const images: Image[] = []

    this.openedFiles.forEach((file: File) => {
      if (file.isImage()) {
        images.push(new Image(file))
      }
    })

    return images
  }

  getOpenedPDFs(): PDF[] {
    const pdfs: PDF[] = []

    this.openedFiles.forEach((file: File) => {
      if (file.isPDF()) {
        pdfs.push(new PDF(file))
      }
    })

    return pdfs
  }

  async open() {
    if (this.isZip()) {
      return await this.openZip(this.file)
    }

    if (this.isRar()) {
      return await this.openRar(this.file)
    }
  }

  private async generateListFiles(folderPath: string) {
    for (const file of fs.readdirSync(folderPath, { withFileTypes: true })) {
      if (file.isFile()) {
        const openedFile = new File(`${folderPath}/${file.name}`)

        if (openedFile.isSupportedFile()) {
          this.openedFiles.push(openedFile)
        }

        if (openedFile.isZip()) {
          try {
            await this.openZip(openedFile)
          } catch {
            console.log(`Ошибка открытия файла ${openedFile.path}`)
          }
        }

        if (openedFile.isRar()) {
          await this.openRar(openedFile)
        }
      } else {
        this.generateListFiles(`${folderPath}/${file.name}`)
      }
    }
  }

  private async openZip(zipFile: File) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(zipFile.path)
        .pipe(
          unzipper.Extract({
            path: `${zipFile.folderPath}/folder-${zipFile.name}`
          })
        )
        .on('error', reject)
        .on('close', async () => {
          return resolve(
            await this.generateListFiles(
              `${zipFile.folderPath}/folder-${zipFile.name}`
            )
          )
        })
    })
  }

  private async openRar(file: File) {
    try {
      const folderForOpenedFiles = `${file.folderPath}/folder-${file.name}`

      //   await unrar(file.path, folderForOpenedFiles)
      createExtractorFromFile(file.path, folderForOpenedFiles).extractAll()
      await this.generateListFiles(folderForOpenedFiles)
    } catch (e) {
      throw e
    }
  }
}
