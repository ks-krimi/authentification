const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

/*
 * envoyer un email avec nodemailer
 */
module.exports.sendEmailWithNodeMailer = (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

/*
 * envoyer un email avec SendGrid mail
 */
module.exports.sendEmailWithSgMail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.to,
    from: process.env.EMAIL_FROM,
    subject: options.subject,
    html: options.html,
  };

  await sgMail.send(msg);
};
