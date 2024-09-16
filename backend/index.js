const express = require("express");
const userRoutes = require('./routes')
const connectDB = require('./config/db');

var cors = require('cors');


const app = express();
const port = 8000;

app.use(express.json());
app.use(cors({
  origin: 'https://friend-me-henna.vercel.app', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


connectDB();

app.use('/',userRoutes);

app.listen(port,()=>console.log(`server is running at port ${port}`));
