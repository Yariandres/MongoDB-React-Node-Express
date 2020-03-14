const mongoose = require('mongoose');
const express = require('express');
let cors = require('cors');
const boddyParser = ('body-parser');
const logger = require('morgan');
const Data = require('./data');


require('dotenv').config();
const api_key = process.env.API_KEY;
console.log(process.env);

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// // Mongo database
const dbRouter = `mongodb+srv://yari:${api_key}@node-express-react-4dzjv.mongodb.net/test?retryWrites=true&w=majority`;

// connects backend to server