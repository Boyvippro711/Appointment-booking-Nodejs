require('dotenv').config();
import { attempt } from 'lodash';
//const nodemailer = require("nodemailer");
import nodemailer from 'nodemailer';


let sendTestEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCare 👻" <ledoanhieu123@gmail.com>', // sender address
        to: dataSend.reciverEmail, // list of receivers
        subject: "Xác thực thời gian khám bệnh ✔", // Subject line
        html: getbodyHTMLEmail(dataSend),
    });
}

let getbodyHTMLEmail = (dataSend) => {
    let result =
        `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên Booking Care</p>
        <p>Thông tin lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <b>Nếu các thông tin trên là đúng, vui lòng nhấn vào đường dẫn bên dưới để xác nhận thủ tục đăth kịch khám bệnh</b>
        <div>
            <a href=${dataSend.redireactLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn</div>
    ` // html body;
    return result;
}

let getbodyHTMLEmailRemady = (dataSend) => {
    // <div><b>Thời gian: ${dataSend.time}</b></div>
    // <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    let result =
        `
    <h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên Booking Care</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi trong tệp đính kèm</p>
    <div>Xin chân thành cảm ơn</div>
    `
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP, // generated ethereal user
                    pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"BookingCare 👻" <ledoanhieu123@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Kết quả khám bệnh ✔", // Subject line
                html: getbodyHTMLEmailRemady(dataSend),
                attachments: [{
                    filename: `remedy.${dataSend.patientId}.${new Date().getTime()}.png`,
                    content: dataSend.imgBase64.split("base64, ")[1],
                    encoding: 'base64',
                }],
            });
            //console.log('check info send email')
            resolve(true);
        } catch (e) {
            reject(e)
        }
    })

}


module.exports = {
    sendTestEmail: sendTestEmail,
    sendAttachment: sendAttachment,
}