const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const { listSvc, registerSvc, removeSvc } = require('./task.service');
require('dotenv').config();

let server;

/**
 * run server
 */
function run() {
  server = createServer((req, res) => {
    /**
     * write http response message
     * @param {number} statusCode http response code, default to 200
     * @param {string} message respose message
     */
    function respond(statusCode, message) {
      res.statusCode = statusCode || 200;
      res.write(message || '');
      res.end();
    }

    // route service based on its pathname
    try {
      const uri = url.parse(req.url, true);
      switch (uri.pathname) {
        case '/register':
          if (req.method === 'POST') {
            return registerSvc(req, res);
          } else {
            respond(404);
          }
          break;
        case '/list':
          if (req.method === 'GET') {
            return listSvc(req, res);
          } else {
            respond(404);
          }
          break;
        case '/remove':
          if (req.method === 'DELETE') {
            return removeSvc(req, res);
          } else {
            respond(404);
          }
          break;
        default:
          respond(404);
      }
    } catch (err) {
      respond(500, 'unkown server error');
    }
  });

  // run server
  const PORT = process.env.TASK_PORT;
  server.listen(PORT, () => {
    stdout.write(`🚀 Task Server listening on port ${PORT}\n`);
  });
}

/**
 * stop server
 */
function stop() {
  if (server) {
    server.close();
  }
}

module.exports = {
  run,
  stop,
};
