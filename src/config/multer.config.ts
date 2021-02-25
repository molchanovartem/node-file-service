import * as multer from 'multer'
import * as fs from 'fs'
import * as path from 'path'
import { v4 } from 'uuid'

export const storageConfig = (fileFolderName: string) => multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `${fileFolderName}/${req.body.uuid}`

        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
  
        cb(null, path);
    },
    filename: (req, file, cb) => {
      cb(null, v4() + path.extname(file.originalname).toLowerCase());
    }
  });