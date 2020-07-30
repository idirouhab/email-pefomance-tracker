const nodemailer = require("nodemailer");

module.exports.send = async (scenario, subject, cb) => {
    if (global.debug) console.log("Send email");
    const message = {
        from: scenario.from,
        to: scenario.to,
        subject: subject,
        text: "",
    };

    let tls = scenario.smtp_tls ? {
        rejectUnauthorized: false
    } : false;

    let transporter = {
        host: scenario.smtp_host,
        port: scenario.smtp_port,
        tls: tls,
        secure: false,
        debug: true
    };
    if (scenario.smtp_user && scenario.smtp_password) {
        transporter["auth"] = {
            type: "login",
            user: scenario.smtp_user,
            pass: scenario.smtp_password,
        };
    }
    const transport = nodemailer.createTransport(transporter)
    await transport.verify();

    return transport.sendMail(message, cb);
};
