require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('./config/passport')
const session = require('express-session')
const jwt = require('jsonwebtoken')
const MongoDBStore = require('connect-mongodb-session')(session)

var indexRouter = require('./routes/index')
var bicicletasRouter = require('./routes/bicicletas')
var usuariosRouter = require('./routes/usuarios')
var bicicletasApiRouter = require('./routes/api/bicicletasApi')
var usuariosApiRouter = require('./routes/api/usuariosApi')
var authApiRouter = require('./routes/api/auth')
var tokenRouter = require('./routes/token')

const Token = require('./models/token')
const Usuario = require('./models/usuario')

let store
if(process.env.NODE_ENV === 'development'){
  store = new session.MemoryStore
}else{
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: 'sessions'
  })
  store.on('error', function(error){
    assert.ifError(error)
    assert.ok(false)
  })
}


let app = express();
app.set('secretKey', 'jwt_pwd_12334566')
app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000 },
  store: store,
  secret: 'red_bicicletas_1234567',
  saveUninitialized: true,
  resave: true
}))

var mongoose = require('mongoose');

var mongoDB = process.env.MONGO_URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection error: '))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res){
  res.render('session/login')
})

app.post('/login', function(req, res, next){
  passport.authenticate('local', function(err, usuario, info){
    console.log(info)
    if(err) return next(err)
    if (!usuario) return res.render('session/login', {info})

    req.logIn(usuario, function(err){
      if(err) return next(err)
      return res.redirect('/')
    })
  })(req, res, next)
})

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/')
})

app.get('/forgotpassword', function(req, res){
  res.render('session/forgotPassword')
})

app.post('/forgotpassword', function(req, res) {
  Usuario.findOne( { email: req.body.email }, function (err, usuario) {
    if (!usuario) return res.render('session/forgotPassword', {info: {message: 'No existe el email para un usuario existente.'}});

    usuario.resetPassword(function(err) {
      if (err) return next(err);
      console.log('session/forgotPasswordMessage');
    });
    
    res.render('session/forgotPasswordMessage');
  });
});

app.get('/resetpassword/:token', function(req, res, next){
  Token.findOne({token: req.params.token}, function(err, token){
    if(!token) return res.status(400).send({ type: 'not-verified', msg: 'No existe un usuar'})
  
    Usuario.findById(token._userId, function(err, usuario){
      if(!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado a ese email.'})
      res.render('session/resetPassword', {errors: {}, usuario: usuario})
    })
  })
})

app.post('/resetpassword', function(req, res){
  if(req.body.password != req.body.confirm_password){
    res.render('session/resetPassword', {errors: {confirm_password: {message: 'No coinciden las contrase??as ingresadas.'}}})
    return
  }
  Usuario.findOne({ email: req.body.email }, function(err, usuario){
    usuario.password = req.body.password
    usuario.save(function(err){
      if(err) {
        res.render('session/resetPassword', { errors: err.errors, usuario: new Usuario({ email: req.body.email })})
      }else{
        res.render('session/login', {info: {message: "Su contrase??a ha sido reestablecida con ??xito."}})
      }
    })
  })
})

app.use('/usuarios', usuariosRouter)
app.use('/token', tokenRouter)

app.use('/bicicletas', loggedIn, bicicletasRouter);

app.use('/api/auth', authApiRouter)
app.use('/api/bicicletas', validarUsuario, bicicletasApiRouter)
app.use('/api/usuarios', usuariosApiRouter)

app.use('/privacy_policy', function(req, res){
  res.sendFile(__dirname + '/public/privacy_policy.html')
})

app.use('/google7009e721bec35a52.html', function(req, res){
  res.sendFile(__dirname + '/public/google7009e721bec35a52.html')
})
app.get('/auth/google',
  passport.authenticate('google', { scope:[
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read'
    ]}
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/',
        failureRedirect: '/error'
}));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next){
  if (req.user){
    next()
  }else{
    console.log('Usuario sin loguearse')
    res.redirect('/login')
  }
}

function validarUsuario(req, res, next){
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded){
    if(err){
      res.json({status:"error", message: err.message, data:null})
    }else{
      req.body.userId = decoded.id 

      console.log('jwt verify: ' + decoded)
      next()
    }
      
  })
}

module.exports = app
