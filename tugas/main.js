const relationship = require('./lib/relationship');
const kv = require('./lib/kv');
const msgbus = require('./lib/msgbus');
const workerServer = require('./workers/server');
const taskServer = require('./tasks/server');

async function relationaldb() {
  try {
    console.log('connect to relational database service...');
    await relationship.init();
    console.log('relational database connected');
  } catch (err) {
    console.error('relational database connection failed');
    return;
  }
}

async function kvdb() {
  try {
    console.log('connect to kv database service...');
    await kv.connect();
    console.log('kv database connected');
  } catch (err) {
    console.error('kv database connection failed');
    return;
  }
}

async function messageBus() {
  try {
    console.log('connect to message bus service...');
    await msgbus.connect();
    console.log('message bus connected');
  } catch (err) {
    console.error('message bus connection failed');
    return;
  }
}

async function main(command) {
  switch (command) {
    case 'task':
      await relationaldb();
      await kvdb();
      await messageBus();
      taskServer.run();
      break;
    case 'worker':
      await relationaldb();
      await kvdb();
      await messageBus();
      workerServer.run();
      break;
    default:
      console.log(`${command} 5tidak dikenali`);
      console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);
