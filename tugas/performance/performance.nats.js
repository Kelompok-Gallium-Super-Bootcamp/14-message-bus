const { sub } = require('../lib/msgbus');
const { workerLog } = require('./performance');

function workerSubscriber() {
  const workerSub = sub('worker', workerSubHandling);
  return;
}

async function workerSubHandling(msg, reply, subject, sid) {
  await workerLog(msg);
}

module.exports = {
  workerSubscriber,
};
