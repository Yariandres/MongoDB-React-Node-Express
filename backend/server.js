const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var logger  = require('morgan');
const Data = require('./data');


require('dotenv').config();
const api_key = process.env.API_KEY;

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// Mongo database
const dbRouter = `mongodb+srv://yari:${api_key}@cluster0-jmg5h.mongodb.net/test?retryWrites=true&w=majority`;

// Connects backend to server
mongoose.connect(dbRouter, { useUnifiedTopology: true } );

let db = mongoose.connection;
db.once('open', () => console.log('connected to the Database'));

// Checks if the connection to db has been successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded( { useNewUrlParser: true }  ));
app.use(bodyParser.json());
app.use(logger('dev'));

// GET -> Fetches availables data from database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({
      success: false,
      error: err
    });
    return res.json({
      success: true,
      data: data
    });
  });
});

// Overwrites existing data in the database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ 
      success: false, 
      error: err 
    });
    return res.json({ success: true });
  });
});

// Removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;

  Data.findByIdAndRemove(id, (err) => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// Adds new data in our database
router.post('/putData', (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.message = message;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));


