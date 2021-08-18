const express = require('express');
const app = express();
const morgan = require('morgan');
const port = 3000;
const server = require('http').Server(app);
const io = require('socket.io')(server)

const path = require('path');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');

const test = require('./relationship');

//Experiment for database


const route = require('./routes');
const cookieParser = require('cookie-parser');

// // test database
//test();

//Using method override to change the method
app.use(methodOverride('_method'))

//use cookie parser to read cookies from browser;
app.use(cookieParser());

//incase pass data with a way of html with post method
app.use(express.urlencoded({
  extended:true
}))

//Configuration static file for website
app.use(express.static(path.join(__dirname,'uploads')));
app.use(express.static(path.join(__dirname,'public')));

//Configuration for template engine handlebars

app.engine('handlebars',handlebars({helpers: {sum:function(a,b){
    return a+b;
}}}));
app.set('view engine','handlebars');
app.set('views',path.join(__dirname,'resources','views'));



//Navigation for website
route(app);


//Use for http logger
app.use(morgan('combined'));

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


app.locals.io = io;
io.on('connection',(socket)=>{
  console.log(socket.id);
  console.log('hello world')
  socket.emit('greeting','Chào mừng bạn đến hệ thống')
});