const { pub } = require('../lib/msgbus');

function addWorkerLog() {
  pub('worker', 'add');
}

function removeWorkerLog() {
  pub('worker', 'remove');
}

module.exports = {
  addWorkerLog,
  removeWorkerLog,
};
