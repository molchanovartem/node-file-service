import * as dotenv from 'dotenv'
dotenv.config()

export default {
  awsEndpoint: process.env.AWS_ENDPOINT || '',
  awsRegion: process.env.AWS_REGION || 'ru-msk',
  jwtSecret: process.env.ACCESS_TOKEN_SECRET || '',
  objectDetectionUrl: process.env.DOC_SEGMENTATION_URL || '',
  popplerPath: process.env.POPPLER_PATH,
  port: process.env.APP_PORT || 3000,
  recognizeToken: process.env.RECOGNIZE_TOKEN || '',
  recognizeUrl: process.env.RECOGNIZE_URL || '',
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  s3BucketName: process.env.S3_BUCKET_NAME || '',
  s3ExpiresTimeForGeneratedLink: process.env.S3_EXPIRES_TIME_FOR_GENERATED_LINK,
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  s3UploadPath: process.env.S3_UPLOAD_PATH || '',
  uploadFolder: process.env.UPLOAD_FOLDER || 'uploads'
}
