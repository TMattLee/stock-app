'use strict';

require('dotenv').config()
var fs = require('fs');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var axios = require('axios')

var open = require('open');

var app = express();

mongoose.connect( process.env.MONGOLAB_URI );

/*------------------------------------------------------------------------------
------------------------------ Mongoose Schemas --------------------------------
------------------------------------------------------------------------------*/

var Schema = mongoose.Schema;

var tickerList = new Schema({
  data: []
});

var TickerList = mongoose.model( 'tickerlist', tickerList );

//------------------------------------------------------------------------------



/*------------------------------------------------------------------------------
------------------------------ Endpoint Configs --------------------------------
------------------------------------------------------------------------------*/

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(__dirname + '/../client'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({ 
  secret: '1d03kdak2k39fjzjAjfdDijAjDJ',
  cookie: { 
    expires:  new Date(Date.now() + 60*60*1000),
  }
}));

app.get("/", (req, res) => {
  res.render("homepage");
});

app.post('/addstock', ( req, res ) => {
  const { stock } = req.body;
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  const url = `https://www.quandl.com/api/v3/datasets/WIKI/${ stock }.json?` +
      `column_index=2` +
      `&api_key=${ process.env.STOCK_API_KEY }` +
      `&start_date=${ year - 1 }-${ month }-${ date }` +
      `&end_date=${ year }-${ month }-${ date }`
  axios({
    method: "GET",
    url: url ,
  })
    .then( ( response ) => {
      const { dataset } = response.data
      if( dataset.data.length === 0 ){
        res.send("NOT_FOUND");
      }
      else {
        res.send( {
          code: dataset.dataset_code,
          prices: dataset.data
        });
      }
    })
    .catch( error =>{
      console.log( error.response.data );
      if( error.response.data.quandl_error.code === 'QECx02' ){
       res.send("NOT_FOUND");
      }
      else{
        res.send("ERROR");
      }
    });
});

app.get('/getcurrent', ( req, res ) => {
  TickerList.findById(
    {
      _id: "5996582df36d28126e472aef",
    },
    ( error, docs ) => {
      if ( error ) console.log( error );
      res.send( docs)
    }
  );
});


/*------------------------------------------------------------------------------
---------------------------------- Socket.io------------------------------------
------------------------------------------------------------------------------*/

const port = 3002;

const server = app.listen(port, function(err) {  
  if (err) {
    console.log(err);
  } else {
    open(`http://localhost:${port}`);
  }
});

const io = require( 'socket.io' )( server, {
  path: '/socket.io'
});

io.on('connection', (socket) => {  
  //console.log('a user connected');

  socket.on('disconnect', () => {
    //console.log('user disconnected');
  });
  
  socket.on( 'GOT_NEW_DATA', ( payload ) =>{
    if( payload && payload.data.length > 0 ){
      if( payload.data.length > 10 ) {
        payload.data.shift();
      }
      TickerList.findByIdAndUpdate(
        {
          _id: "5996582df36d28126e472aef"
        },
        {
          data: payload.data
        },
        {
          new: true,
          upsert: true
        },
        ( error, doc ) =>{
          if ( error ) console.log( error );
          io.emit( 'RECEIVE_DATA', { data: doc.data } )
        }
      );
    }
  });
});
//------------------------------------------------------------------------------