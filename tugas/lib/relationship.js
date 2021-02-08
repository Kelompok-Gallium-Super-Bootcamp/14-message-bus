/* eslint-disable no-unused-vars */
const { Sequelize } = require('sequelize');
const path = require('path');
const { defineTask } = require('../tasks/task.model');
const { defineWorker } = require('../workers/model');
require('dotenv').config();

exports.orm;
let worker, task;

/**
 * connect and sync database schema
 * @param {string} database database name
 * @param {string} username connection username
 * @param {string} password caonnection password
 * @param {any} config additional sequelize configs
 */
exports.connect = async function (database, username, password, config) {
  exports.orm = new Sequelize(database, username, password, {
    ...config,
    logging: false,
    timestamps: false,
  });
  exports.orm.authenticate();
  initRelationship();
  exports.orm.sync({ alter: true });
};

function setupRelationship(orm) {
  worker = defineWorker(orm);
  taskModel.defineModel(exports.orm);

  taskModel.model.belongsTo(worker, {
    onDelete: 'cascade', // set null, restrict
    foreignKey: 'assignee_id',
  });
}

async function init() {
  const orm =
    process.env.DB_ENGINE_TYPE == 'sqlite'
      ? new Sequelize('', '', '', {
          storage: path.join(__dirname, '../', process.env.DB_FILE),
          dialect: process.env.DB_DIALECT,
          logging: false,
        })
      : new Sequelize(
          process.env.DB_NAME,
          process.env.DB_USER,
          process.env.DB_PASS,
          {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            dialect: process.env.DB_DIALECT,
            logging: false,
          }
        );
  await orm.authenticate();
  setupRelationship(orm);
  await orm.sync({ alter: true });
}

async function write(table, data) {
  switch (table) {
    case 'worker':
      return worker.create(data);
    case 'task':
      return task.create(data);
    default:
      return 'table not found;';
  }
}

async function update(table, idx, data) {
  switch (table) {
    case 'worker':
      return worker.update(data, {
        where: {
          id: idx,
        },
      });
    case 'task':
      return task.update(data, {
        where: {
          id: idx,
        },
      });
    default:
      return 'table not found;';
  }
}

async function updateStatus(idx, data) {
  return task.update(
    { status: data },
    {
      where: {
        id: idx,
      },
    }
  );
}

async function read(table) {
  switch (table) {
    case 'worker':
      return worker.findAll();
    case 'task':
      return task.findAndCountAll({
        include: worker,
      });
    default:
      return 'table not found;';
  }
}

async function del(table, idx) {
  switch (table) {
    case 'worker':
      return worker.destroy({
        where: {
          id: idx,
        },
      });
    case 'task':
      return task.destroy({
        where: {
          id: idx,
        },
      });
    default:
      return 'table not found;';
  }
}

module.exports = {
  init,
  write,
  read,
  del,
  update,
  updateStatus,
};
