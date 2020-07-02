# Email Performance Tracker

A simple application that performs check to monitor SMPT as well as IMAP and POP3 emails servers.

## Requirements
- nodejs v12
- npm 6.14.0 or above

## Configuration
It's a yaml based file to execute the different round-trip tests.
Each scenario is independent and runs synchronously.



| Field                         | Value           | Required              | Comment     |
| ------                        | -----------     | -----------           | ----------- |
| version                       | int             | true                  | Version of the current project.|
| subject                       | string          | true                  | Tag the email sent with an specific subject.  |
| debug                         | bool            | true                  ||
| proxy                         | false or object | false                 ||
| proxy.host                    | string          | true                  ||
| proxy.port                    | int             | true                  ||
| proxy.auth                    | object          | false                 ||
| proxy.auth.username           | string          | false                 ||
| proxy.auth.password           | string          | false                 ||
| newrelic                      | object          | true                  ||
| newrelic.account_id           | int             | true                  | New Relic account where the data should be reported. Get it from [here](https://docs.newrelic.com/docs/accounts/install-new-relic/account-setup/account-id)   |
| newrelic.insert_key           | string          | true                  | Key to push data into New Relic Insights. [Here](https://docs.newrelic.com/docs/insights/insights-data-sources/custom-data/introduction-event-api#register) are the instructions on how to create an insert key.   |
| scenarios                     | array<object>   | true                  ||
| protocol                      | string          | true                  |Values must be either `pop3` or `imap`|
| folder                        | string          | false                 |POP3 doesn't support folders, this field is only need for IMAP.<br/>Default: `INBOX`|
| scenarios[].from              | string          | true                  |Specify the email address of the email's sender.|
| scenarios[].to                | string          | true                  |Specify the address that the SMTP server will send the emails to.|
| scenarios[].smtp_host         | string          | true                  ||
| scenarios[].smtp_port         | int             | true                  ||
| scenarios[].smtp_user         | string          | false                 ||
| scenarios[].smtp_password     | string          | false                 ||
| scenarios[].smtp_tls          | bool            | false                 | Default: `false`|
| scenarios[].protocol_host     | string          | true                  ||
| scenarios[].protocol_port     | int             | true                  ||
| scenarios[].protocol_user     | string          | false                 ||
| scenarios[].protocol_password | string          | false                 ||
| scenarios[].protocol_tls      | bool            | false (default false) | Default: `false`|



## Examples

### SMTP, IMAP and POP3 with authentication and tls enabled and proxy without authentication
```
version: 1
subject: "New Relic Roundtrip Mail"
debug: false
proxy:
  host: "localhost"
  port: 8888
newrelic:
  accountId:
  insertKey: ""
scenarios:
  - from: "me@email.com"
    to: "foo@bar.com"
    smtp_host: "smtp.server.com"
    smtp_port: 465
    smtp_user: "theowneer@email.com"
    smtp_password: "SUPER_SECURE_PASSWORD"
    protocol: "imap"
    protocol_host: "imap.server.com"
    protocol_port: 993
    protocol_user: "again@me.com"
    protocol_password: "MORE_SECURE_THAN_BEFORE"
    protocol_tls: true
    folder: "INBOX"
  - from: "me@email.com"
    to: "foo@bar.com"
    smtp_host: "smtp.server.com"
    smtp_port: 465
    smtp_user: "theowneer@email.com"
    smtp_password: "SUPER_SECURE_PASSWORD"
    protocol: "pop3"
    protocol_host: "pop3.server.com"
    protocol_port: 995
    protocol_user: "new@one.com"
    protocol_password: "IM_STILL_SECURE"
    protocol_tls: true
```

### SMTP with authentication and IMAP and POP3 without authentication and tls disabled and proxy with authentication
```
version: 1
subject: "New Relic Roundtrip Mail"
debug: false
proxy:
  host: "localhost"
  port: 8888
  auth:
    username: "foobar"
    password: "secret"
newrelic:
  accountId:
  insertKey: ""
scenarios:
  - from: "me@email.com"
    to: "foo@bar.com"
    smtp_host: "smtp.server.com"
    smtp_port: 465
    smtp_user: "theowneer@email.com"
    smtp_password: "SUPER_SECURE_PASSWORD"
    protocol: "imap"
    protocol_host: "imap.server.com"
    protocol_port: 993
    protocol_tls: false
    folder: "INBOX"
  - from: "me@email.com"
    to: "foo@bar.com"
    smtp_host: "smtp.server.com"
    smtp_port: 465
    smtp_user: "theowneer@email.com"
    smtp_password: "SUPER_SECURE_PASSWORD"
    protocol: "pop3"
    protocol_host: "pop3.server.com"
    protocol_port: 995
    protocol_tls: false
```


### SMTP, IMAP and POP3 without authentication and tls enabled without proxy
```
version: 1
subject: "New Relic Roundtrip Mail"
debug: false
newrelic:
  accountId:
  insertKey: ""
scenarios:
  - from: "me@email.com"
    to: "foo@bar.com"
    smtp_host: "smtp.server.com"
    smtp_port: 465
    protocol: "imap"
    protocol_host: "imap.server.com"
    protocol_port: 993
    protocol_tls: false
    folder: "INBOX"
  - from: "me@email.com"
    to: "foo@bar.com"
    smtp_host: "smtp.server.com"
    smtp_port: 465
    protocol: "pop3"
    protocol_host: "pop3.server.com"
    protocol_port: 995
    protocol_tls: false
```

## Run with an existing docker container

```shell script
$ docker run -v ${PWD}/config.yaml:/usr/src/app/config.yaml idirouhab/email-tracker:latest
```

## Run with docker

In the root folder and with the configuration file run:
```shell script
$  docker build -t email-monitoring .
$  docker run email-monitoring:latest
```

