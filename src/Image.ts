import { v4 } from 'uuid'

import { File } from './File'
import { s3Client } from './s3Client'

export class Image extends File {
  file: File
  s3path: string = ''

  constructor(file: File) {
    super(file.path)

    this.file = file
  }

  public async pushToS3(s3path: string) {
    this.s3path = s3path + v4() + this.extension

    try {
      await s3Client.pushToMCS(this.path, this.s3path)
    } catch (e) {
      this.s3path = ''
    }
  }
}
