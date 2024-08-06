var createError = require('http-errors');
var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const fs = require('fs');
var multer = require('multer')
const { createCanvas, loadImage } = require('canvas');

const url = require('url');
const { send } = require('process');

require('dotenv').config();

var app = express();
app.use(cors())
const port = process.env.PORT || 4000;
// view engine setup


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var upload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
  }
})

var storage = multer({ storage: upload });


app.get('/', function (req, res, next) {

  res.send('hi' );
});


 let pathaa;
app.post('/genOG', storage.single('img'), async function (req, res) {

  console.log(req.file)
  const uploadedFile = req.file;

  const imgCanvas = createCanvas(1200, 630);
  const crx = imgCanvas.getContext('2d');



  const toBeDrawnImg = await loadImage(req.file.destination + '/' + req.file.filename);
  crx.drawImage(toBeDrawnImg, 0, 0, 1200, 630)
  crx.font = '600 100px OpenSans'

  crx.strokeStyle = '#FFF';
  crx.fillText(req.body.desc, 100, 300)

  fs.writeFileSync('./' + req.file.filename.substring(0, 11)  + 'modified.jpg', imgCanvas.toBuffer('image/jpeg'));


 pathaa = __dirname + '/' + req.file.filename.substring(0, 11) + 'modified.jpg'

res.sendStatus(200);

});

app.get('/gen', function (req, res) {

  res.download(pathaa)
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;
