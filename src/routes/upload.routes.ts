import { Router } from 'express'
import { uploadFiles } from '../controllers/upload.controller'

const router = Router();

router.route('/')
    .post(uploadFiles);

export default router;