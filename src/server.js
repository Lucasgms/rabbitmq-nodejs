import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const server = require('http').Server(app);
// Porta onde o servidor express irá rodar.
const port = 3001;
const helmet = require('helmet');

const amqp = require('amqplib/callback_api');


app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

app.post('/', (req, res) => {
  amqp.connect('amqp://localhost:5672', (err, conn) => {
    conn.createChannel((err, ch) => {
      ch.assertQueue('my-queue');
      ch.sendToQueue('my-queue', new Buffer(req.body.message));
    });
  });

  res.status(200);
  res.json('Mensagem enviada com sucesso!');
  res.send('working');
  res.end();
});

//pre-flight requests
app.options('*', function(req, res) {
	res.send(200);
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	/* eslint-disable no-console */
	console.log('Node Endpoints working :)');
});
