import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import serverConfig from './server.config';
import serverRoutes from './tests.routes';
import cors from 'cors';

// import config from '../webpack.config.dev';
// import ssi from 'ssi';
// import fs from 'fs';
// import open from 'open';
// import webpack from 'webpack';
// import compression from 'compression';
// const parser = new ssi(__dirname, "", "");

/* eslint-disable no-console */

const {SERVER_PORT} = serverConfig;
const app = express();
//const compiler = webpack(config);

const srcDirectory = './../src';


//app.use(compression());
app.use(cors());
app.use(bodyParser.json({limit: '100mb'})); // for parsing application/json
// app.use(require('webpack-dev-middleware')(compiler, {
//   noInfo: true,
//   publicPath: config.output.publicPath
// }));

//app.use(require('webpack-hot-middleware')(compiler));
app.use('/', serverRoutes);


//For any request return this file
app.get('*', (req, res) => {
  //debugger
  res.sendFile(path.join(__dirname, srcDirectory + '/' + req.url));
});


app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    //open(`http://localhost:${port}`);
  }
});
