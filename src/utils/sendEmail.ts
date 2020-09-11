import * as nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (
  email: string,
  link: string,
  username: string,
  password: string,
) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'apikey', // generated ethereal user
      pass: process.env.SENDGRID_API_KEY, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Tu Tran" <tu.tran@netpower.no>', // sender address
    to: email, // list of receivers
    subject: 'CONFIRM EMAIL ADDRESS FOR GDPR SYSTEM', // Subject line
    text: 'Hello ✔', // plain text body
    html: `<h1>Welcome to GDPR system</h1>
    <b>Your username: ${username}</b>
    <br/>
    <b>Your password: ${password}</b>
    <br/>
    <br/>
    <b>Please click</b> <a href="${link}"> here </a>
    <b>to confirm your email</b>`, // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
