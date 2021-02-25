import * as cors from 'cors'
import * as multer from 'multer'
import * as jwtAuth from 'express-jwt'

import config from '../config/environment.config'
import { storageConfig } from '../config/multer.config'
import { authMiddleware } from '../middlewares/auth.middleware'

module.exports = [
  cors(),
  multer({ storage: storageConfig(config.uploadFolder) }).array('docs'),
  jwtAuth({ secret: config.jwtSecret, algorithms: ['HS256'] }),
  authMiddleware
]
