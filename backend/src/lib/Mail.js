import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../config/mail';

class Mail {
    constructor() {
        const { host, port, secure, auth } = mailConfig;

        this.transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth.user ? auth : null,
        });

        this.configureTemplates();
    }

    configureTemplates() {
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');

        // handlebars use compile
        this.transporter.use(
            'compile',
            nodemailerhbs({
                viewEngine: exphbs.create({
                    layoutsDir: resolve(viewPath, 'layouts'), // path layout in folder email
                    partialsDir: resolve(viewPath, 'partial'), // path parital in folder email
                    defaultLayout: 'default',
                    extname: '.handlebars',
                }),
                viewPath,
                extname: '.handlebars',
            })
        );
    }

    sendMail(message) {
        return this.transporter.sendMail({
            ...mailConfig.default,
            ...message,
        });
    }
}

export default new Mail();
