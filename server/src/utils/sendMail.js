import {transporter} from "../config/nodemailer.js"

export const sendMail =  async({name, email, message}) => {
     const mailOption = {
        from: process.env.MAIL_USER,
        to: email,
        subject: `New message from ${name}`,
    
        text: `
            Name: ${name}
            Email: ${email}
            Message: ${message}
        `,
      };
      await transporter.sendMail(mailOption)
}