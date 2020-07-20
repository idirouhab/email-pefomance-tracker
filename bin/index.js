#!/usr/bin/env node

const yargs = require("yargs");

const options = yargs
  .usage("Usage: -n <name>")
  .option("p", { alias: "protocol", describe: "Protocol <SMTP,IMAP,POP3>", type: "string", demandOption: true })
  .argv;

const greeting = `Hello, ${options.protocol}!`;

console.log(greeting);

