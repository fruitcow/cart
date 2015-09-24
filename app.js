
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index.js');

var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose =require('mongoose');
var session = require('express-session');
var app = express();
global.dbHelper = require( './common/dbHelper' );
mongoose.connect("mongodb://127.0.0.1:27017/test");
 
app.use(session({
    secret:'secret',
    cookie:{
        maxAge:1000*60*30
    }
}));
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());



app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.locals.user = req.session.user; 
    var err = req.session.error;  
    res.locals.message = '';  
    if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
    next();
});
app.use(app.router);
routes(app);
app.get('/', function(req, res) {
    res.render('login');
});
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
