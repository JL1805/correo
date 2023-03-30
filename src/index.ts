import express,{Application, Request, Response} from "express";
import cors from 'cors';
import MailService from './Services/mailService';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import { MailInterface } from "./interfaces/MailInterface";
import { ResetPaswordInterface } from "./interfaces/ResetPaswordInterface";
import departmentUserAdd from "./templates/departmentUserAddTemplate";
import { Attachments } from "./interfaces/AttachmentsInterface";
dotenv.config();
const app : Application = express();

//CORS
app.use( cors() );

//Lectura del body
app.use( express.json() )

const PORT = 3000;

const PruebaCorreos = async () =>{
    //CREAR INSTANCIA
    const mailService = MailService.getInstance();
    //await mailService.createLocalConnection();
    await mailService.createConnection();



    //CON UN CUSTOM TEMPLATE CON PARAMETROS PERSONALIZADOS
        const dataTemplate : ResetPaswordInterface = {
            //resetPasswordUrl: "https:localhost/reset-pasword/3a90c8ff-7ef5-4eb8-a620-420fd213f404",
            resetPasswordUrl: "https://www.youtube.com/watch?v=W7sY9gJZp4M",
            firstName: "JL node correo test",
            departmentName: "TI"
        }
        const emailTemplate  = departmentUserAdd(dataTemplate);
        
        const attachments : Attachments = {
            attachments : [
                {filename: "ine.png", path: __dirname + '/Files/CAPTURA.png'},
                {filename: "pdf.pdf", path: __dirname + '/Files/pdf.pdf'},
            ]
        }
        const data : MailInterface = {
            from: "firmenti@flising.com",
            to:   "jvillalobos@firmenti.com,joseluis.villalobos1805@gmail.com",
            subject: "Mensaje desde NODE",
            text: emailTemplate.text,
            html: emailTemplate.html,
            attachments
        }
        // console.log(mailService.verifyConnection())
        // console.log(mailService.getTransporter())

    //MANDAR EL CORREO
        const resp = await mailService.sendMail(uuidv4(),data)
        console.log(resp)
}

PruebaCorreos();

app.listen(PORT, ()=>{
    console.log(`ONLINE EN PUERTO: `+ PORT)
})
