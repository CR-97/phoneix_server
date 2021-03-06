const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const axios =require('axios');
const cors = require('cors');
const app = express();


const db = require('./config/config-key').mongoKey;
const token = require('./config/apiKey').token1;
const data = require('./route/data');
const standing = require('./route/standingData');
const scorer = require('./route/scorerData');
var Users = require('./route/Users');

//Body-Parser + Cors
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//Connect to mongoose db
mongoose.connect(db,{ useNewUrlParser: true })
.then(()=>{
  console.log('Connected to database...');
})
.catch((error)=>{
  console.log('Connection Failed : ',error);
});


/*----------- MongoDB Data -------------*/
app.use(data);
/*----------- End of MongoDB Data -------------*/
app.use(standing);
app.use(scorer);
app.use(Users);

/*----------- News Api Get -------------*/
const apiKey = '1f6d73f2182140c199a4accba1194b89';
const url = `https://newsapi.org/v2/top-headlines?sources=four-four-two&apiKey=${apiKey}`;
const url2 = `https://newsapi.org/v2/top-headlines?sources=football-italia&apiKey=${apiKey}`;
const url3 = `https://newsapi.org/v2/top-headlines?sources=talksport&apiKey=${apiKey}`;

app.get('/getNews1', (req, res) => {
  axios.get(url)
    .then((response) => {
     
      res.status(200).json(response.data);
    })
    .catch((error) => {
      
      res.status(404).json(error);
    })
});

app.get('/getNews2', (req, res) => {
  axios.get(url2)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
     
      res.status(404).json(error);
    })
});

app.get('/getNews3', (req, res) => {
  axios.get(url3)
    .then((response) => {
      
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(404).json(error);
    })
});

//Search News
app.get('/getSearch', (req,res)=>{
  const q = req.query.q;
  const query = `https://newsapi.org/v2/top-headlines?q=${q}&apiKey=${apiKey}`;

  axios.get(query)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.send("Not Found");
      res.status(404).json(error);
    })

});

//End of News Api Get

//FootBall Api Get
const matches
 = 'https://api.football-data.org/v2/matches';

app.get('/getMatches', (req, res) => {
  axios.get(matches,{
    headers: { 'X-Auth-Token': token }
  })
  .then((response) => {
     
      res.status(200).json(response.data);
  })
  .catch((error) => {
      res.status(404).json(error);
  })
});

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
  console.log(`Server started on port ${port}`);
});