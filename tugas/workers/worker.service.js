const Busboy = require('busboy');
const url = require('url');
const { Writable } = require('stream');
const {
  register,
  list,
  remove,
  ERROR_REGISTER_DATA_INVALID,
  ERROR_WORKER_NOT_FOUND,
} = require('./worker');
const { saveFile } = require('../lib/storage');
const { addWorkerLog, removeWorkerLog } = require('./worker.nats');

function registerSvc(req, res) {
  const busboy = new Busboy({ headers: req.headers });

  const data = {
    name: '',
    address: '',
    email: '',
    telephone: '',
    biography: '',
    photo: '',
  };

  let finished = false;

  function abort() {
    req.unpipe(busboy);
    if (!req.aborted) {
      res.statusCode = 413;
      res.end();
    }
  }

  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    switch (fieldname) {
      case 'photo':
        try {
          data.photo = await saveFile('photo', file, mimetype);
        } catch (err) {
          abort();
        }
        if (finished) {
          try {
            const worker = await register(data);
            addWorkerLog();
            res.setHeader('content-type', 'application/json');
            res.write(JSON.stringify(worker));
          } catch (err) {
            if (err === ERROR_REGISTER_DATA_INVALID) {
              res.statusCode = 401;
            } else {
              res.statusCode = 500;
            }
            res.write(err);
          }
          res.end();
        }
        break;
      default: {
        const noop = new Writable({
          write(chunk, encding, callback) {
            setImmediate(callback);
          },
        });
        file.pipe(noop);
      }
    }
  });

  busboy.on('field', (fieldname, val) => {
    if (
      ['name', 'address', 'email', 'telephone', 'biography'].includes(fieldname)
    ) {
      data[fieldname] = val;
    }
  });

  busboy.on('finish', async () => {
    finished = true;
  });

  req.on('aborted', abort);
  busboy.on('error', abort);

  req.pipe(busboy);
}

async function listSvc(req, res) {
  try {
    const workers = await list();
    res.setHeader('content-type', 'application/json');
    res.write(JSON.stringify(workers));
    res.end();
  } catch (err) {
    res.statusCode = 500;
    res.end();
    return;
  }
}

async function removeSvc(req, res) {
  const uri = url.parse(req.url, true);
  const id = uri.query['id'];
  if (!id) {
    const ERROR_ID_NOT_FOUND = 'parameter id tidak ditemukan';
    res.statusCode = 401;
    res.write(ERROR_ID_NOT_FOUND);
    res.end();
    return;
  }
  try {
    const worker = await remove(parseInt(id));
    removeWorkerLog();
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.write(JSON.stringify(worker));
    res.end();
  } catch (err) {
    if (err === ERROR_WORKER_NOT_FOUND) {
      res.statusCode = 404;
      res.write(err);
      res.end();
      return;
    }
    res.statusCode = 500;
    res.end();
    return;
  }
}

module.exports = {
  listSvc,
  registerSvc,
  removeSvc,
};
