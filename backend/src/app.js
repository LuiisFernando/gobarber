import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
    constructor() {
        this.server = express();

        this.middlwares();
        this.routes();
    }

    middlwares() {
        this.server.use(express.json());

        // to server static file on route /files passing the path by parameter
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
