# postchi
Send email from the command line using SMTP or major service providers.

## Supported Providers
- [x] [SMTP](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol)
- [x] [SparkPost](https://sparkpost.com)
- [x] [AWS SES](https://aws.amazon.com/ses)
- [ ] [Mailgun](https://mailgun.com)
- [ ] [Mailjet](https://mailjet.com)
- [ ] [Mandrill](https://mandrill.com)
- [ ] [Postmark](https://postmarkapp.com)
- [ ] [SendGrid](https://sendgrid.com)

## Installation

```
npm install -g postchi
```

## Sample
```
$ postchi \
    --from david@pinkfloyd.com \
    --from-name David \
    --to roger@pinkfloyd.com \
    --to-name Roger \
    --subject 'Dark Side of the Moon' \
    --text @body.txt \
    --html @body.html \
    --attachment @time.mp3 \
    --image @prism.png \
    --smtp-host smtp.example.com \
    --smtp-username myusername \
    --smtp-password myp@ssw0rd
```

## Usage
### Sender
```
--from <address>
--from-name <text> (optional)
```

### Recipients
```
--to <address>
--to-name <text> (optional)
```

```
--cc <address>
--cc-name <text> (optional)
```

```
--bcc <address>
--bcc-name <text> (optional)
```

All of these options can be specified multiple times to send to multiple recipients:

```
--to roger@pinkfloyd.com --to-name Roger
--to richard@pinkfloyd.com --to-name Richard
--to nick@pinkfloyd.com --to-name Nick
```

### Subject
```
--subject <text>
```

### Body
```
--text <value>
--html <value>
```

If you want to read from file, use the following syntax:

```
--html @body.html
```

### Attachments
Attachments can be either read from file:

```
--attachment @message.txt
```

Or, specified directly:

```
--attachment 'Hello World'
--attachment-filename 'message.txt'
--attachment-content-type 'text/plain'
```

### Inline Images
Exactly like attachments:

```
--image @image.png
```

And you can use them in your email as:

```
<img src="cid:image.png" />
```

### Transport
```
--transport <smtp|sparkpost|ses> (default: smtp)
```

### SMTP
```
--smtp-host <address>
--smtp-port <number> (default: 587)
--smtp-secure <boolean> (default: true)
--smtp-username <text>
--smtp-password <text>
```

### SparkPost
```
--sparkpost-apikey <text>
--sparkpost-open-tracking <boolean> (default: false)
--sparkpost-click-tracking <boolean> (default: false)
```

### AWS SES
```
--ses-region <text>
--ses-access-key-id <text>
--ses-secret-access-key <text>
```

## Version History
+ **1.0**
	+ Initial release.

## Author
**Soheil Rashidi**

+ http://soheilrashidi.com
+ http://twitter.com/soheilpro
+ http://github.com/soheilpro

## Copyright and License
Copyright 2019 Soheil Rashidi.

Licensed under the The MIT License (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

http://www.opensource.org/licenses/mit-license.php

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
