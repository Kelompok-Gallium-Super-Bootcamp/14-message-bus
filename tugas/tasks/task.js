const taskModel = require('./task.model');

const ERROR_DATA_TASK_MISSING = 'data task tidak lengkap';
const ERROR_DATA_TASK_INVALID = 'data task invalid';
const ERROR_WORKER_ID_INVALID = 'data pekerja invalid';
const ERROR_TASK_NOT_FOUND = 'task tidak ditemukan';
const INFO_TASK_WORKER_WAS_SUBMITTED =
  'task sudah diassigne ke pekerja tersebut';

const { Op } = require('sequelize');

/**
 * task type definition
 * @typedef {Object} taskData
 * @property {[string]} id
 * @property {string} name
 * @property {number} age
 * @property {string} bio
 * @property {string} address
 * @property {string} photo
 */

function rowToData(task) {
  return {
    id: task.id,
    name: task.name,
    age: task.age,
    bio: task.bio,
    address: task.address,
    photo: task.photo,
  };
}

/**
 * register new task
 * @param {taskData} data task profile
 * @returns {Promise<task>} new task profile with id
 */
async function register(data) {
  if (!data.job || !data.status || !data.workerId || !data.document) {
    throw ERROR_DATA_TASK_MISSING;
  }

  if (isNaN(data.workerId)) {
    throw ERROR_WORKER_ID_INVALID;
  }
  if (!['progress', 'cancel', 'done'].includes(data.status.toLowerCase())) {
    throw ERROR_DATA_TASK_INVALID;
  }

  // let worker
  // worker = await taskModel.model.findByPk(id);
  // if (!task) {
  //   throw ERROR_TASK_NOT_FOUND;
  // }
  // let workers = await read('worker');
  // var findWorker = workers.find((worker) => {
  //   return worker.id == data.workerId;
  // });
  // if (!findWorker) {
  //   throw ERROR_WORKER_NOT_FOUND;
  // }

  // let tasks = await read('task');
  // var findTask = tasks.rows.find((taskData) => {
  //   return taskData.job == data.job && taskData.assignee_id == data.workerId;
  // });
  // if (findTask) {
  //   throw INFO_TASK_WORKER_WAS_SUBMITTED;
  // }

  const task = await taskModel.model.create({
    job: data.job,
    status: data.status,
    assignee_id: data.workerId,
    document: data.document,
  });
  return rowToData(task);
}

/**
 * get list of registered tasks
 * @returns {Promise<task[]>} list of registered tasks
 */
async function list() {
  const res = await taskModel.model.findAll({
    where: {
      [Op.not]: [{ status: 'cancel' }],
    },
  });
  return res.rows.map((row) => rowToData(row));
}

/**
 * remove a task by an id
 * @param {string} id task id
 * @returns {Promise<task>} removed task
 */
async function remove(id) {
  const task = await taskModel.model.findByPk(id);
  if (!task) {
    throw ERROR_TASK_NOT_FOUND;
  }
  await task.destroy();
  return rowToData(task);
}

module.exports = {
  register,
  list,
  remove,
  ERROR_DATA_TASK_MISSING,
  ERROR_DATA_TASK_INVALID,
  ERROR_WORKER_ID_INVALID,
  ERROR_TASK_NOT_FOUND,
  INFO_TASK_WORKER_WAS_SUBMITTED,
};
