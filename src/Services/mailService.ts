import nodemailer from 'nodemailer';
import { MailInterface } from './../interfaces/MailInterface';


export default class MailService {
    private static instance: MailService;
    private transporter!: nodemailer.Transporter;
    //private transporter: nodemailer.Transporter | undefined;

    private constructor() { }


    //INTSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }


    //CONEXION LOCAL PARA TEST
    async createLocalConnection() {
        let account = await nodemailer.createTestAccount();
        console.log(account)
        this.transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
    }


    //CONEXION CON CREDENCIALES
    async createConnection() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    //SEND MAIL
    async sendMail(
        requestId: string | number | string[],
        options: MailInterface
    ) {
        return await this.transporter
            .sendMail({ 
                from: options.from,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
                attachments: options.attachments?.attachments 
            })
            .then((info) => {
                console.log(`${requestId} - Mail enviado correctamente!!`);
                
                //guardarlog 
                console.log(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
                return info;
            }).catch((error) =>{
                console.log(`${requestId} - Error al mandar el correo :(`);
                
                //guardarlog 
                return error;
            })
    }
    //VERIFY CONNECTION
    async verifyConnection() {
        return this.transporter.verify();
    }
    //CREATE TRANSPOTER
    getTransporter() {
        return this.transporter;
    }
}
