#!/usr/bin/env node

const fs = require('fs');
const mime = require('mime');
const yargs = require('yargs')
  .strict(true)
  .option('transport', { choices: fs.readdirSync(__dirname + '/transport').map(filename => filename.replace('.js', '')), default: 'smtp' })
  .option('from', { type: 'string', demand: true, alias: 'f' })
  .option('from-name', { type: 'string' })
  .option('to', { type: 'array', demand: true, alias: 't' })
  .option('to-name', { type: 'array', default: [] })
  .option('cc', { type: 'array', default: [] })
  .option('cc-name', { type: 'array', default: [] })
  .option('bcc', { type: 'array', default: [] })
  .option('bcc-name', { type: 'array', default: [] })
  .option('subject', { type: 'string', alias: 's' })
  .option('text', { type: 'string', alias: 'x' })
  .option('html', { type: 'string', alias: 'h' })
  .option('attachment', { type: 'array', default: [], alias: 'a' })
  .option('attachment-filename', { type: 'array', default: [] })
  .option('attachment-content-type', { type: 'array', default: [] })
  .option('image', { type: 'array', default: [], alias: 'i' })
  .option('image-filename', { type: 'array', default: [] })
  .option('image-content-type', { type: 'array', default: [] })

function readInput() {
  return new Promise(resolve => {
    let data = Buffer.alloc(0);

    process.stdin.on('data', chunk => {
      data = Buffer.concat([data, chunk]);
    });

    process.stdin.on('end', () => {
      resolve(data);
    });
  });
}

function getRecipient(address, name) {
  return {
    address: address,
    name: name,
  };
}

async function getBuffer(value) {
  if (!value)
    return Buffer.alloc(0);

  if (value === '-')
    return await readInput();

  if (value.startsWith('@')) {
    const filename = value.substring('@'.length);

    return fs.readFileSync(filename);
  }

  return Buffer.from(value, 'utf8');
}

function getAttachment(value, filename, contentType) {
  if (value.startsWith('@')) {
    const attachmentFilename = value.substring('@'.length);

    return {
      filename: filename || attachmentFilename,
      contentType: contentType || mime.getType(attachmentFilename),
      content: fs.readFileSync(attachmentFilename),
    };
  }

  return {
    filename: filename || 'file',
    contentType: contentType || 'application/octet-stream',
    content: Buffer.from(value, 'utf8'),
  };
}

async function main() {
  const argv = yargs.argv;

  const Transport = require('./transport/' + argv['transport']);
  const transport = new Transport(yargs);

  const message = {
    from: getRecipient(argv['from'], argv['from-name']),
    to: argv['to'].map((address, index) => getRecipient(address, argv['to-name'][index])),
    cc: argv['cc'].map((address, index) => getRecipient(address, argv['cc-name'][index])),
    bcc: argv['bcc'].map((address, index) => getRecipient(address, argv['bcc-name'][index])),
    subject: argv['subject'],
    text: await getBuffer(argv['text']),
    html: await getBuffer(argv['html']),
    attachments: argv['attachment'].map((value, index) => getAttachment(value, argv['attachment-filename'][index], argv['attachment-content-type'][index])),
    images: argv['image'].map((value, index) => getAttachment(value, argv['image-filename'][index], argv['image-content-type'][index])),
  };

  transport.send(message).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

main();
