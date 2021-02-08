const relationship = require('./lib/relationship');
const workerServer = require('./workers/server');
const taskServer = require('./tasks/server');

async function db() {
  try {
    console.log('connect to relational database service...');
    await relationship.init();
    console.log('relational database connected');
  } catch (err) {
    console.error('relational database connection failed');
    return;
  }
}

async function main(command) {
  switch (command) {
    case 'task':
      await db();
      taskServer.run();
      break;
    case 'worker':
      await db();
      workerServer.run();
      break;
    default:
      console.log(`${command} 5tidak dikenali`);
      console.log('command yang valid: task, worker');
  }
}

main(process.argv[2]);
