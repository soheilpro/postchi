const SparkPost = require('sparkpost');

function formatRecipient(recipient) {
  return (recipient.name ? `"${recipient.name}" ` : '') + `<${recipient.address}>`;
}

class SparkPostTransport {
  constructor(yargs) {
    const argv = yargs
      .option('sparkpost-apikey', { type: 'string', demand: true })
      .option('sparkpost-open-tracking', { type: 'boolean', default: false })
      .option('sparkpost-click-tracking', { type: 'boolean', default: false })
      .argv;

    this.client = new SparkPost(argv['sparkpost-apikey']);
    this.options = {
      openTracking: argv['sparkpost-open-tracking'],
      clickTracking: argv['sparkpost-click-tracking'],
    };
  }

  send(message) {
    const options = {
      content: {
        from: {
          email: message.from.address,
          name: message.from.name,
        },
        subject: message.subject,
        text: message.text.toString('utf8'),
        html: message.html.toString('utf8'),
        inline_images: message.images.map(image => ({
          name: image.filename,
          type: image.contentType,
          data: image.content.toString('base64'),
        })),
        attachments: message.attachments.map(attachment => ({
          name: attachment.filename,
          type: attachment.contentType,
          data: attachment.content.toString('base64'),
        })),
        headers: {
          CC: message.cc.length > 0 ? message.cc.map(formatRecipient).join(', ') : undefined,
        }
      },
      recipients: [
        ...message.to.map(recipient => ({
          address: {
            email: recipient.address,
            name: recipient.name,
          },
        })),
        ...message.cc.map(recipient => ({
          address: {
            email: recipient.address,
            name: recipient.name,
            header_to: formatRecipient(message.to[0]),
          },
        })),
        ...message.bcc.map(recipient => ({
          address: {
            email: recipient.address,
            name: recipient.name,
            header_to: formatRecipient(message.to[0]),
          },
        })),
      ],
      options: {
        open_tracking: this.options.openTracking,
        click_tracking: this.options.clickTracking,
      }
    };

    return this.client.transmissions.send(options);
  }
}

module.exports = SparkPostTransport;
