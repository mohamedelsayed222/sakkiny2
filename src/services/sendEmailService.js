import nodemailer from 'nodemailer'
const sendEmail=async({from=process.env.GMAIL,
      to,bcc,cc,subject,text,html,attachments=[]}={})=>{
const transporter = nodemailer.createTransport({
    service:"gmail",
      auth: {
        user:  process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });
    const info = await transporter.sendMail({
        from, // sender address
        to, // list of receivers
        bcc,
        cc,
        subject, // Subject line
        text, // plain text body
        html, // html body
        attachments
      });
}

export default sendEmail;