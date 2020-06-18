const aws = require('aws-sdk');

function formatRecipient(recipient) {
  return (recipient.name ? `"${recipient.name}" ` : '') + `<${recipient.address}>`;
}

class SESTransport {
  constructor(yargs) {
    const argv = yargs
      .option('ses-region', { type: 'string', demand: true })
      .option('ses-access-key-id', { type: 'string', demand: true })
      .option('ses-secret-access-key', { type: 'string', demand: true })
      .argv;

    this.ses = new aws.SES({
      region: argv['ses-region'],
      accessKeyId: argv['ses-access-key-id'],
      secretAccessKey: argv['ses-secret-access-key'],
    });
  }

  send(message) {
    return new Promise((resolve, reject) => {
      if (message.attachments.length !== 0)
        reject(new Error('Attachments are not supported in this transport.'));

      if (message.images.length !== 0)
        reject(new Error('Images are not supported in this transport.'));

      const options = {
        Source: formatRecipient(message.from),
        Destination: {
          ToAddresses: message.to.map(recipient => formatRecipient(recipient)),
          CcAddresses: message.cc.map(recipient => formatRecipient(recipient)),
          BccAddresses: message.bcc.map(recipient => formatRecipient(recipient)),
        },
        Message: {
          Subject: {
            Data: message.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Text: {
              Data: message.text.toString('utf8'),
              Charset: 'UTF-8',
            },
            Html: {
              Data: message.html.toString('utf8'),
              Charset: 'UTF-8',
            },
          },
        },
      };

      this.ses.sendEmail(options, (error) => {
        if (error)
          return reject(error);

        return resolve();
      });
    });
  }
}

module.exports = SESTransport;
