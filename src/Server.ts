import * as express from 'express'
import { Application } from 'express'

// Routes
import UploadRoutes from './routes/upload.routes'

export class Server {
    app: Application;

    constructor(
        private port?: number | string
    ) {
        this.app = express();
        this.settings();
        this.middlewares();
        this.routes();
    }

    private settings() {
        this.app.set('port', this.port);
    }

    private middlewares() {
        this.app.use(require('./middlewares/index'));
    }

    private routes() {
        this.app.use('/upload', UploadRoutes);
    }

    async listen(): Promise<void> {
        await this.app.listen(this.app.get('port'));
        console.log('Server on port', this.app.get('port'));
    }
}