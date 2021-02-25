import * as path from 'path'

export class File {
    readonly path: string
    readonly folderPath: string
    readonly name: string
    readonly extension: string

    private imageExtensions = ['.jpg', '.jpeg', '.png']

    constructor(filePath: string) {
        this.path = filePath
        this.folderPath = filePath.split('/').slice(0, -1).join('/')
        this.name = path.basename(filePath)
        this.extension = path.extname(filePath).toLowerCase()
    }

    isImage(): boolean {
        return this.imageExtensions.includes(this.extension)
    }

    isPDF(): boolean {
        return this.extension === '.pdf'
    }

    isArchive(): boolean {
        return this.isRar() || this.isZip()
    }
    
    isZip(): boolean {
        return this.extension === '.zip'
    }

    isRar(): boolean {
        return this.extension === '.rar'
    }

    isSupportedFile(): boolean {
        return this.isArchive() || this.isPDF() || this.isImage()
    }
}