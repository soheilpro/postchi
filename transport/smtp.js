const nodemailer = require("nodemailer");

class SMTPTransport {
  constructor(yargs) {
    const argv = yargs
      .option('smtp-host', { type: 'string', demand: true })
      .option('smtp-port', { type: 'number', default: 587 })
      .option('smtp-secure', { type: 'boolean', default: true })
      .option('smtp-username', { type: 'string' })
      .option('smtp-password', { type: 'string' })
      .argv;

    this.transport = nodemailer.createTransport({
      host: argv['smtp-host'],
      port: argv['smtp-port'],
      secure: argv['smtp-secure'],
      auth: {
        user: argv['smtp-username'],
        pass: argv['smtp-password'],
      },
    });
  }

  send(message) {
    const options = {
      from: message.from,
      to: message.to,
      cc: message.cc,
      bcc: message.bcc,
      subject: message.subject,
      text: message.text.toString('utf8'),
      html: message.html.toString('utf8'),
      attachments: [
        ...message.attachments.map(attachment => ({
          filename: attachment.filename,
          contentType: attachment.contentType,
          content: attachment.content,
        })),
        ...message.images.map(image => ({
          filename: image.filename,
          contentType: image.contentType,
          content: image.content,
          cid: image.filename,
        })),
      ],
    };

    return this.transport.sendMail(options);
  }
}

module.exports = SMTPTransport;
