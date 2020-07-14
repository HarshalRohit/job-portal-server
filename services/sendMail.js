const { email } = require('../config');
const nodemailer = require("nodemailer");

const pug = require('pug');
const emailPugPath = __dirname+'/../views/emailBody.pug';

const compiledFunction = pug.compileFile(emailPugPath);



let transporter = nodemailer.createTransport({
    service: email.EmService,
    auth: {
      user: email.EmUser,
      pass: email.EmPass
    },
});

const constructEmailBody = (userInfo) => {

    const timeObj = new Date();
    const pugOptions = {
        name: userInfo.name,
        contact: userInfo.contact,
        date: timeObj.toString(),
    };
    const html = compiledFunction(pugOptions);
    
    return html;
}

const sendEmail = async ({ userInfo, attachmentPath, jobInfo}) => {
    
    const html = constructEmailBody(userInfo);

    const message = {
        from: email.EmUser,
        to: ['rohitharshal95@gmail.com', 'Rahulgore@live.in'],
        subject: `Application for ${jobInfo.jobTitle} in ${jobInfo.company}` +
            ` by ${userInfo.name}`,
        html: html,
        attachments: {
            path: attachmentPath
        }
    };

    const info = await transporter.sendMail(message);
    console.log(info.messageId);

};

module.exports = sendEmail;