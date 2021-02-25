import * as AWS from 'aws-sdk'
import * as fs from 'fs'

import config from './config/environment.config'

AWS.config.update({
  region: config.awsRegion,
})

const s3 = new AWS.S3({
  endpoint: config.awsEndpoint,
  accessKeyId: config.s3AccessKeyId,
  secretAccessKey: config.s3SecretAccessKey
})

export class s3Client {
  static async pushToMCS(filePath: string, s3path: string) {
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          Body: fs.readFileSync(filePath),
          Bucket: config.s3BucketName,
          Key: s3path
        },
        (err, res) => {
          if (err) {
            console.log(err)
            reject(err)
          } else {
            resolve(res)
          }
        }
      )
    })
  }

  static generateLink(key: string) {
    return s3.getSignedUrl('getObject', {
      Bucket: config.s3BucketName,
      Key: key,
      Expires: Number(config.s3ExpiresTimeForGeneratedLink)
    })
  }
}
