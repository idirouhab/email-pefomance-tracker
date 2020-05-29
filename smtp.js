const nodemailer = require("nodemailer");

module.exports.send = (scenario, subject, cb) => {
    if (global.debug) console.log('Send email');
    const message = {
        from: scenario.from,
        to: scenario.to,
        subject: subject,
        text: "",
    };

    let transporter = {
        host: scenario.smtp_host,
        port: scenario.smtp_port,
        secure: scenario.smtp_tls | false,
    };

    if (scenario.smtp_user && scenario.smtp_password) {
        transporter['auth'] = {
            user: scenario.smtp_user,
            pass: scenario.smtp_password,
        }
    }

    return nodemailer.createTransport(transporter).sendMail(message, cb);
};
