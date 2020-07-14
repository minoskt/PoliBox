// General
const https = require('https');
const http = require('http');
const express = require('express');
//const request = require('request');
const bodyParser = require('body-parser');

// DataBox
const databox = require('node-databox');
const DATABOX_ARBITER_ENDPOINT = process.env.DATABOX_ARBITER_ENDPOINT || 'tcp://127.0.0.1:4444';
const DATABOX_ZMQ_ENDPOINT = process.env.DATABOX_ZMQ_ENDPOINT || 'tcp://127.0.0.1:5555';
const DATABOX_TESTING = !(process.env.DATABOX_VERSION);

const PORT = DATABOX_TESTING ? 8090 : process.env.PORT || '8080';

//this will ref the timeseriesblob client which will observe and write to the databox actuator (created in the driver)
let stores = {};

if (DATABOX_TESTING) {
  stores['redditSimulatorData'] = databox.NewStoreClient(DATABOX_ZMQ_ENDPOINT, DATABOX_ARBITER_ENDPOINT, false);
  stores['MPUSimulatorData'] = databox.NewStoreClient(DATABOX_ZMQ_ENDPOINT, DATABOX_ARBITER_ENDPOINT, false);
} else {
  const redditSimulatorData = databox.HypercatToDataSourceMetadata(process.env['DATASOURCE_redditSimulatorData']);
  console.log('redditSimulatorData: ', redditSimulatorData);
  const redditSimulatorDataStore = databox.GetStoreURLFromHypercat(process.env['DATASOURCE_redditSimulatorData']);
  console.log('redditSimulatorDataStore: ', redditSimulatorDataStore);
  stores['redditSimulatorData'] = databox.NewStoreClient(redditSimulatorDataStore, DATABOX_ARBITER_ENDPOINT, false);

  const mpuSimulatorData = databox.HypercatToDataSourceMetadata(process.env['DATASOURCE_MPUSimulatorData']);
  console.log('mpuSimulatorData: ', mpuSimulatorData);
  const mpuSimulatorDataStore = databox.GetStoreURLFromHypercat(process.env['DATASOURCE_MPUSimulatorData']);
  console.log('mpuSimulatorDataStore: ', mpuSimulatorDataStore);
  stores['MPUSimulatorData'] = databox.NewStoreClient(mpuSimulatorDataStore, DATABOX_ARBITER_ENDPOINT, false);
}

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/ui', function (req, res) {
  res.type('html');
  res.send(`
    <h1>Ancile App</h1>

    <p>AncileCore should use the supported endpoints to read data written from allowed drivers.</p>
    <p>Supported endpoints for TSBlob datastores are:</p>

    <ul>
      <li>/app-ancile/ui/tsblob/latest</li>
      <li>/app-ancile/ui/tsblob/earliest</li>
      <li>/app-ancile/ui/tsblob/last_n</li>
      <li>/app-ancile/ui/tsblob/first_n</li>
      <li>/app-ancile/ui/tsblob/since</li>
      <li>/app-ancile/ui/tsblob/range</li>
      <li>/app-ancile/ui/tsblob/length</li>
    </ul>
  `);
});

app.get('/ui/tsblob/latest', function (req, res) {
  const { data_source_id } = req.query;

  // Check if datasource_id is available
  if (!data_source_id) {
    throw new Error('data_source_id is missing');
  }

  // read data
  stores[data_source_id].TSBlob.Latest(data_source_id).then((result) => {
    console.log('result:', data_source_id, result);
    res.type('json');
    res.send({
      data_source_id,
      data: result,
    });
  }).catch((err) => {
    console.log('get config error', err);
    throw new Error(err);
  });
});

app.get('/ui/tsblob/earliest', function (req, res) {
  const { data_source_id } = req.query;

  // Check if data_source_id is available
  if (!data_source_id) {
    throw new Error('data_source_id is missing');
  }

  // read data
  stores[data_source_id].TSBlob.Earliest(data_source_id).then((result) => {
    console.log('result:', data_source_id, result);
    res.type('json');
    res.send({
      data_source_id,
      data: result,
    });
  }).catch((err) => {
    console.log('get config error', err);
    throw new Error(err);
  });
});

app.get('/ui/tsblob/last_n', function (req, res) {
  const { data_source_id, n } = req.query;

  // Check if data_source_id is available
  if (!data_source_id) {
    throw new Error('data_source_id is missing');
  }

  // Check if n is available
  if (!n) {
    throw new Error('n is missing');
  }

  // read data
  stores[data_source_id].TSBlob.LastN(data_source_id, n).then((result) => {
    console.log('result:', data_source_id, result);
    res.type('json');
    res.send({
      data_source_id,
      n,
      data: result,
    });
  }).catch((err) => {
    console.log('get config error', err);
    throw new Error(err);
  });
});

app.get('/ui/tsblob/first_n', function (req, res) {
  const { data_source_id, n } = req.query;

  // Check if data_source_id is available
  if (!data_source_id) {
    throw new Error('data_source_id is missing');
  }

  // Check if n is available
  if (!n) {
    throw new Error('n is missing');
  }

  // read data
  stores[data_source_id].TSBlob.FirstN(data_source_id, n).then((result) => {
    console.log('result:', data_source_id, result);
    res.type('json');
    res.send({
      data_source_id,
      n,
      data: result,
    });
  }).catch((err) => {
    console.log('get config error', err);
    throw new Error(err);
  });
});

app.get('/ui/tsblob/since', function (req, res) {
  const { data_source_id, since_timestamp } = req.query;

  // Check if data_source_id is available
  if (!data_source_id) {
    throw new Error('data_source_id is missing');
  }

  // Check if since_timestamp is available
  if (!since_timestamp) {
    throw new Error('n is missing');
  }

  // read data
  stores[data_source_id].TSBlob.Since(data_source_id, since_timestamp).then((result) => {
    console.log('result:', data_source_id, result);
    res.type('json');
    res.send({
      data_source_id,
      since_timestamp,
      data: result,
    });
  }).catch((err) => {
    console.log('get config error', err);
    throw new Error(err);
  });
});

app.get('/ui/tsblob/range', function (req, res) {
  const { data_source_id, from_timestamp, to_timestamp } = req.query;

  // Check if data_source_id is available
  if (!data_source_id) {
    throw new Error('data_source_id is missing');
  }

  // Check if from_timestamp is available
  if (!from_timestamp) {
    throw new Error('from_timestamp is missing');
  }

  // Check if to_timestamp is available
  if (!to_timestamp) {
    throw new Error('to_timestamp is missing');
  }

  // read data
  stores[data_source_id].TSBlob.Range(data_source_id, from_timestamp, to_timestamp).then((result) => {
    console.log('result:', data_source_id, result);
    res.type('json');
    res.send({
      data_source_id,
      from_timestamp,
      to_timestamp,
      data: result,
    });
  }).catch((err) => {
    console.log('get config error', err);
    throw new Error(err);
  });
});

app.get('/ui/tsblob/length', function (req, res) {
  const { data_source_id } = req.query;

  // read data
  stores[data_source_id].TSBlob.Length(data_source_id).then((result) => {
    console.log('result:', data_source_id, result);
    res.type('json');
    res.send({
      data_source_id,
      data: result,
    });
  }).catch((err) => {
    console.log('get config error', err);
    throw new Error(err);
  });
});

app.get('/status', function (req, res) {
  res.send('active');
});

//when testing, we run as http, (to prevent the need for self-signed certs etc);
if (DATABOX_TESTING) {
  console.log('[Creating TEST http server]', PORT);
  http.createServer(app).listen(PORT);
} else {
  console.log('[Creating https server]', PORT);
  const credentials = databox.GetHttpsCredentials();
  https.createServer(credentials, app).listen(PORT);
}
