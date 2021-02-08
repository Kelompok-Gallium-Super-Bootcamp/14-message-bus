const { listWorkerTotal } = require('./performance');

async function workerTotalSvc(req, res) {
  try {
    const total = await listWorkerTotal();
    res.write(total.toString());
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = {
  workerTotalSvc,
};
