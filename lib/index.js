"use strict";

/**
 * Module dependencies
 */

/* eslint-disable import/no-unresolved */
/* eslint-disable prefer-template */
// Public node modules.
const _ = require("lodash");
const nodemailer = require("nodemailer");

/**
 * Converts a string to a bool.
 *  - match 'true', 'on', or '1' as true.
 *  - ignore all white-space padding
 *  - ignore capitalization (case).
 **/
const toBool = (val) => /^\s*(true|1|on)\s*$/i.test(val);

/* eslint-disable no-unused-vars */
module.exports = {
  provider: "nodemailer",
  name: "Nodemailer",
  auth: {
    nodemailer_default_from: {
      label: "Nodemailer Default From",
      type: "text",
    },
    nodemailer_default_replyto: {
      label: "Nodemailer Default Reply-To",
      type: "text",
    },
    host: {
      label: "Host",
      type: "text",
    },
    port: {
      label: "Port",
      type: "number",
    },
    password: {
      label: "Password",
      type: "string",
    },
    username: {
      label: "username",
      type: "string",
    },
    connectionTimeout: {
      label: "ConnectionTimeout",
      type: "number",
    },
    secure: {
      label: "Secure",
      type: "enum",
      values: ["FALSE", "TRUE"],
    },
    requireTLS: {
      label: "RequireTLS",
      type: "enum",
      values: ["FALSE", "TRUE"],
    },
    rejectUnauthorized: {
      label: "RejectUnauthorized",
      type: "enum",
      values: ["FALSE", "TRUE"],
    },
  },

  init: (config) => {
    let transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: toBool(config.secure),
      auth: {
        username: config.username,
        password: config.password,
      },
      tls: {
        rejectUnauthorized: toBool(config.rejectUnauthorized),
      },
      requireTLS: toBool(config.requireTLS),
      connectionTimeout: config.connectionTimeout * 60 * 1000, // 5 min
    });

    return {
      send: (options) => {
        return new Promise((resolve, reject) => {
          // Default values.
          options = _.isObject(options) ? options : {};
          options.from = config.nodemailer_default_from || options.from;
          options.replyTo =
            config.nodemailer_default_replyto || options.replyTo;
          options.text = options.text || options.html;
          options.html = options.html || options.text;

          const msg = [
            "from",
            "to",
            "cc",
            "bcc",
            "subject",
            "text",
            "html",
            "attachments",
          ];

          transporter
            .sendMail(_.pick(options, msg))
            .then(resolve)
            .catch((error) => reject(error));
        });
      },
    };
  },
};
