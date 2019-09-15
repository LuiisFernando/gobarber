import 'dotenv/config';

import express from 'express';
import path from 'path';
import * as Sentry from '@sentry/node';
import Youch from 'Youch';

import 'express-async-errors'; // used to send the errors to sentry

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
    constructor() {
        this.server = express();

        Sentry.init(sentryConfig);

        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    middlewares() {
        // The request handler must be the first middleware on the app
        this.server.use(Sentry.Handlers.requestHandler());

        this.server.use(express.json());

        // to server static file on route /files passing the path by parameter
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
        );
    }

    routes() {
        this.server.use(routes);

        // The error handler must be before any other error middleware and after all controllers
        this.server.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            if (process.env.NODE_ENV === 'development') {
                const errors = await new Youch(err, req).toJSON();

                return res.status(500).json(errors);
            }

            return res.status(500).json({ error: 'Internal server error' });
        });
    }
}

export default new App().server;
