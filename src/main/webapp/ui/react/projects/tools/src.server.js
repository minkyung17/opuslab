import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from '../webpack.config.dev';
import open from 'open';
import cors from 'cors';
import fs from 'fs';
import ssi from 'ssi';
import colors from 'colors';
import compression from 'compression';

/* eslint-disable no-console */
const port = 3005;
const app = express();
const compiler = webpack(config);
const parser = new ssi(__dirname, "", "");
const srcDirectory = '/../src';


/*eslint-disable no-console */
console.log('Starting app in dev mode...'.green);

//app.use(compression());
app.use(cors());
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

//For any request return this file
app.get('*', function (req, res) {
  //debugger
  res.sendFile(path.join(__dirname, srcDirectory + '/' + req.url));
});


app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    //open(`http://localhost:${port}`);
  }
});
