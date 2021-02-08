const nats = require('nats');
let client;

function connect() {
  return new Promise((resolve, reject) => {
    client = nats.connect();
    client.on('connect', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
  });
}

function sub(subjectName, callback) {
  return client.subscribe(subjectName, callback);
}

function unsub(subscriber) {
  return client.unsubscribe(subscriber);
}

function pub(subjectName, msg) {
  client.publish(subjectName, msg);
}

function close() {
  if (client.connected) {
    client.close();
  }
}

module.exports = {
  connect,
  sub,
  unsub,
  pub,
  close,
};
