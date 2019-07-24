/*CHECKEA LOS FORMULARIOS Y LOS GUARDA EN LA BASE DE DATOS*/

var express = require('express'); //llamamos express
var router = express.Router(); // llamamos al router de express
const UserModel=require('../models/user'); // llamamos al modelo del Usuario
const transporter=require('../config/nodemailer');//importo lo que exporto desde el archivo noedmailer
const jwt=require('jsonwebtoken');// llamo a jsonwebtoken
const SECRET_JWT=require('../config/password').SECRET_JWT;//importo lo que exporto desde el archivo password
const AUTH_JWT=require('../config/password').AUTH_JWT;//
const winston=require('../config/winston');//importo lo que exporto desde el archivo winston
const uploadPics=require('../config/multer');//importo lo que exporto desde el archivo multer
const bcrypt=require('bcrypt');


router.post('/register', function (req,res,next){//endpoint
  console.log(req.body);
  
  new UserModel({
    ...req.body,
    confirmedEmail:false
  }).save()
  .then(user=>{
    console.log("esto es el usuario", user)
    const token=jwt.sign({_id:user._id}, SECRET_JWT, {expiresIn:"48h"})
    console.log("esto es el token")
    const url=`http://localhost:3000/users/activacion/${token}`
    console.log("esto es la url", url)
    transporter.sendMail({//enviamos el email con la siguiente información//
      from:"bootcampstream@gmail.com",//procedencia del email
      to:user.email,//destinatario del email
      subject:"Active su cuenta en nuestra web de viajes",//asunto del email
      html:`
          <h1>Bienvenido a nuestra web de viajes</h1>
          <p>Por favor, active su cuenta clicando el siguiente link:</p>
          <a href="${url}">Click aquí para activar tu cuenta</a>
          `//mensaje para el destinatario
    });
    res.status(201).render('registro') // si todo va bien devolvemos el usuario como respuesta a la petición
  })
    .catch(console.log) // en caso de error devolvemos el error como respuesta a la petición 
});

router.get( '/activacion/:jwt', ( req, res ) => {//endpoint
  try {
      const payload = jwt.verify( req.params.jwt, SECRET_JWT )
      console.log( "esto es el payload ", payload )
      UserModel.findByIdAndUpdate( payload._id, { confirmedEmail: true },{new:true} )
          .then( user => res.render("activo") )
  } catch ( error ) {
      res.status( 400 ).send( error )
  }
} )

router.post( '/login', ( req, res ) => {//endpoint
  UserModel.findOne({
    $or: [ // checks if either the username or the email are in the database
        { username: req.body.usernameEmail }, 
        { email: req.body.usernameEmail }
    ]
  })
  .then( user => {
    if ( !user ) return res.status( 400 ).send( 'Wrong credentials' ); // if the user/email does not exist in the db responds with this message
    if ( user.confirmedEmail === false ) return res.status( 400 ).send( 'You have to verify your email' ); //if the user exist but the email is not confirmed yet. It responds with this message.
    bcrypt.compare( req.body.password, user.password ).then( isMatch => { //the first argument is the plain text password entered by the user, the second argument is the password hash in the db.
        if ( !isMatch ) return res.status( 400 ).send( 'Wrong credentials' ); //if there is no match between the password entered by the user and the one in the db it responds with "Wrong Credentials"
        const token= user.generateAuthToken();
        user.token=token;
        res.redirect("/"); // if both the username/email and the password are correct, it responds with the user as a json.
    })
  })
})

router.post('/recovery', ( req, res ) => {//endpoint
  const token=jwt.sign({email:req.body.email},SECRET_JWT,{expiresIn:"2d"})
    transporter.sendMail({//enviamos el email con la siguiente información//
    from:"bootcampstream@gmail.com",//procedencia del email
    to:req.body.email,//destinatario del email
    subject:"Cambie su contraseña",//asunto del email
    html:`
        <h1>Bienvenido a nuestra web de viajes</h1>
        <p>Por favor, cambie su contraseña clicando el siguiente link:</p>
        <a href="http://localhost:3000/users/resetPass/${token}">Click aquí para cambiar su contraseña</a>
        `//mensaje para el destinatario
      })
  res.status(201).render('pass') // si todo va bien devolvemos el usuario como respuesta a la petición
});   

router.get('/resetPass/:token',(req,res)=>{
res.render('resetPass')
})

router.post('/resetPass2', async (req,res)=>{
  try {
  const token = req.headers.referer.split('/')[5];
  const email=jwt.verify(token,SECRET_JWT).email;
  const salt= await bcrypt.genSalt(9)
  const hash= await  bcrypt.hash(req.body.password, salt)
  await UserModel.findOneAndUpdate({email}, {  password: hash })
  res.render('resetPass2')
  } 
  catch (error) {
      console.log(error)
      res.status(500).send(error)
  }
})

router.post('/uploadImage', uploadPics.single('avatar'), (req,res)=>{//endpoint multer
  console.log(req.file.fieldname);
  res.send('has subido con exito tu imagen a ' + req.file.path)
})

module.exports = router; //exporto el router para llamarlo en la app.js