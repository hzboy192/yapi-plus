const path = require('path');
const fs = require('fs-extra');
const nodemailer = require('nodemailer');
let config = require('../../config.json');

// 支持通过环境变量覆盖配置（适用于 Vercel 等云平台）
if (process.env.MONGODB_CONNECTION_STRING) {
  config.db = config.db || {};
  config.db.connectString = process.env.MONGODB_CONNECTION_STRING;
}

// 数据库配置的环境变量支持
if (process.env.DB_SERVERNAME) {
  config.db = config.db || {};
  config.db.servername = process.env.DB_SERVERNAME;
}
if (process.env.DB_DATABASE) {
  config.db = config.db || {};
  config.db.DATABASE = process.env.DB_DATABASE;
}
if (process.env.DB_PORT) {
  config.db = config.db || {};
  config.db.port = parseInt(process.env.DB_PORT, 10);
}
if (process.env.DB_USER) {
  config.db = config.db || {};
  config.db.user = process.env.DB_USER;
}
if (process.env.DB_PASS) {
  config.db = config.db || {};
  config.db.pass = process.env.DB_PASS;
}
if (process.env.DB_AUTH_SOURCE) {
  config.db = config.db || {};
  config.db.authSource = process.env.DB_AUTH_SOURCE;
}

// 邮件配置的环境变量支持
if (process.env.MAIL_HOST) {
  config.mail = config.mail || {};
  config.mail.host = process.env.MAIL_HOST;
}
if (process.env.MAIL_PORT) {
  config.mail = config.mail || {};
  config.mail.port = parseInt(process.env.MAIL_PORT, 10);
}
if (process.env.MAIL_FROM) {
  config.mail = config.mail || {};
  config.mail.from = process.env.MAIL_FROM;
}
if (process.env.MAIL_USER) {
  config.mail = config.mail || {};
  config.mail.auth = config.mail.auth || {};
  config.mail.auth.user = process.env.MAIL_USER;
}
if (process.env.MAIL_PASS) {
  config.mail = config.mail || {};
  config.mail.auth = config.mail.auth || {};
  config.mail.auth.pass = process.env.MAIL_PASS;
}

// 端口配置
if (process.env.PORT) {
  config.port = process.env.PORT;
}

let insts = new Map();
let mail;

const WEBROOT = path.resolve(__dirname, '..'); //路径
const WEBROOT_SERVER = __dirname;
const WEBROOT_RUNTIME = path.resolve(__dirname, '../..');
const WEBROOT_LOG = path.join(WEBROOT_RUNTIME, 'log');
const WEBCONFIG = config;

fs.ensureDirSync(WEBROOT_LOG);

if (WEBCONFIG.mail && WEBCONFIG.mail.enable) {
  mail = nodemailer.createTransport(WEBCONFIG.mail);
}

/**
 * 获取一个model实例，如果不存在则创建一个新的返回
 * @param {*} m class
 * @example
 * yapi.getInst(groupModel, arg1, arg2)
 */
function getInst(m, ...args) {
  if (!insts.get(m)) {
    insts.set(m, new m(args));
  }
  return insts.get(m);
}

function delInst(m) {
  try {
    insts.delete(m);
  } catch (err) {
    console.error(err); // eslint-disable-line
  }
}


let r = {
  fs: fs,
  path: path,
  WEBROOT: WEBROOT,
  WEBROOT_SERVER: WEBROOT_SERVER,
  WEBROOT_RUNTIME: WEBROOT_RUNTIME,
  WEBROOT_LOG: WEBROOT_LOG,
  WEBCONFIG: WEBCONFIG,
  getInst: getInst,
  delInst: delInst,
  getInsts: insts
};
if (mail) r.mail = mail;
module.exports = r;