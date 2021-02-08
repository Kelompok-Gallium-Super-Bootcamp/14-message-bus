const { createServer } = require('http');
const url = require('url');
const { stdout } = require('process');
const { workerTotalSvc } = require('./performance.service');

let server;

/**
 * run server
 */
function run() {
  server = createServer((req, res) => {
    function respond(statusCode, message) {
      res.statusCode = statusCode || 200;
      res.write(message || '');
      res.end();
    }

    // route service based on its pathname
    try {
      const uri = url.parse(req.url, true);
      switch (uri.pathname) {
        case '/worker/total':
          if (req.method === 'GET') {
            return workerTotalSvc(req, res);
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
  const PORT = 9132;
  server.listen(PORT, () => {
    stdout.write(`🚀 server listening on port ${PORT}\n`);
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
