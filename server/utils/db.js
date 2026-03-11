const mongoose = require('mongoose');
const yapi = require('../yapi.js');
const autoIncrement = require('./mongoose-auto-increment');

function model(model, schema) {
  if (schema instanceof mongoose.Schema === false) {
    schema = new mongoose.Schema(schema);
  }

  schema.set('autoIndex', false);

  return mongoose.model(model, schema, model);
}

// 存储 mongoose.connect 返回的 Promise，供插件使用
let connectPromise;

function connect(callback) {
  mongoose.Promise = global.Promise;

  let config = yapi.WEBCONFIG;
  let options = {};

  if (config.db.user) {
    options.user = config.db.user;
    options.pass = config.db.pass;
  }

  if (config.db.reconnectTries) {
    options.reconnectTries = config.db.reconnectTries;
  }

  if (config.db.reconnectInterval) {
    options.reconnectInterval = config.db.reconnectInterval;
  }


  options = Object.assign({}, options, config.db.options)

  var connectString = '';

  if(config.db.connectString){
    connectString = config.db.connectString;
  }else{
    connectString = `mongodb://${config.db.servername}:${config.db.port}/${config.db.DATABASE}`;
    if (config.db.authSource) {
      connectString = connectString + `?authSource=${config.db.authSource}`;
    }
  }

  // 在连接前初始化 autoIncrement（它只需要 mongoose，不需要实际的连接）
  autoIncrement.initialize(mongoose);

  connectPromise = mongoose.connect(connectString, options)
    .then(function(db) {
      yapi.commons.log('mongodb load success...');
      if (typeof callback === 'function') {
        callback.call(db);
      }
    })
    .catch(function(err) {
      yapi.commons.log(err + 'mongodb connect error', 'error');
    });

  return connectPromise;
}

yapi.db = model;

module.exports = {
  model: model,
  connect: connect
};
