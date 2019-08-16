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

const apiKey = process.env.STOCK_API_KEY;

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
  var now = new Date("03/01/2018");
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  const url = `https://www.quandl.com/api/v3/datasets/WIKI/${ stock }.json?`
      + `column_index=2`
      + `&api_key=${ apiKey }`
      + `&start_date=${ year - 1 }-${ month }-${ date }`
      + `&end_date=${ year }-${ month }-${ date }`;
      
  axios({
    method: "GET",
    url: url ,
  })
    .then( ( response ) => {
      const { dataset } = response.data
      if( dataset.data.length === 0 ){
        return res.send("NOT_FOUND");
      }
      
      res.send( {
        code: dataset.dataset_code,
        prices: dataset.data
      });
      
    })
    .catch( error =>{
      console.log( error.response.data );
      
      if( error.response.data.quandl_error.code === 'QEAx01' ){
        return res.send("API_ERROR");
      }
      
      if( error.response.data.quandl_error.code === 'QECx02' ){
        return res.send("NOT_FOUND");
      }
     
      return res.send("ERROR");
      
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

const port = process.env.PORT;

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
        ( error, doc ) => {
          if ( error ) console.log( error );
          io.emit( 'RECEIVE_DATA', { data: doc.data } )
        }
      );
    }
  });
});
//------------------------------------------------------------------------------