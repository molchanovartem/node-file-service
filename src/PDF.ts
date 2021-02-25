import * as fs from 'fs'
import * as Poppler from 'node-poppler'

import { File } from './File'
import { Image } from './Image'
import config from './config/environment.config'

export class PDF extends File {
    file: File
    readonly openedImages: Image[]

    constructor(file: File) {
        super(file.path)

        this.file = file
        this.openedImages = []
    }

    getOpenedImages(): Image[] {
        return this.openedImages
    }

    public async open() {
        let openedFilesPath: string[] = []
        const outputPath = `${this.folderPath}/folder-${this.name}`

        try {
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath);
            }

            const poppler = new Poppler.Poppler(config.popplerPath)
            await poppler.pdfImages(this.path, `${outputPath}/${this.name}`, { jpegFile: true })
          } catch (e) {
            openedFilesPath = []
          }

          for (const fileName of fs.readdirSync(outputPath)) {
            this.openedImages.push(new Image(new File(`${outputPath}/${fileName}`)))
          }
    }
}