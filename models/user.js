/*CREO MIS ESQUEMAS */
const mongoose = require( 'mongoose' );
const { isEmail } = require( 'validator' );
const bcrypt=require('bcrypt');
const SALT=10;
const jwt=require('jsonwebtoken');
const SECRET_AUTH_JWT=require('../config/password').SECRET_AUHT_JWT;

const userSchema = new mongoose.Schema( {
    email: {
        type: String,
        unique: true,
        required: true,
        validate: function ( email ) {
            return new Promise( function ( resolve ) {
                setTimeout( function () {
                    resolve( isEmail( email ) );
                }, 5 );
            } );
        },
    },
    username: {
        type: String,
        unique: true,
        required:true,
    },
    password: {
        type: String,
        minlength: 8,
        required:true,
    },
    confirmedEmail: Boolean,
}, 
{
   timestamps: true,
});

userSchema.methods.toJSON = function () { //override of the toJSON method to add token and remove password fields
    const { _id, name, lastname, username, email, token } = this; //here we take the user properties
    return { _id, name, lastname, username, email, token }; //here we return the user properties
};


userSchema.pre('save', function (next) { // mongoose middleware, se ejecuta previo al save()
  const user = this; //utilizamos function de ES5 para acceder al this
  if (user.isModified('password')) { //condicionamos a que el password hay sido cambiado
    bcrypt.genSalt(SALT)
.then(salt => bcrypt.hash(user.password, salt) // generamos el salt y generamos el hash con el password en texto plano y  el salt
.then(hash => { 
      user.password = hash;  // asignamos el hash como campo password antes de guardar en la base de datos
      return next(); //damos paso a la función save() del model de mongoose
    }).catch(err => next(err))).catch(err => next(err)) //capturamos errores de haberlos
  } else next(); //sino ha sido modificado el password pasa al save directamente
});

userSchema.methods.generateAuthToken=function(){
    const user=this
    const token=jwt.sign({_id:user._id}, SECRET_AUTH_JWT,{ expiresIn:"7d"})
    return token;
}

const UserModel= mongoose.model('User',userSchema); // generamos el modelo a partir del schema, sus middlewares y sus métodos
module.exports=UserModel; //exportamos el model para utilizarlo donde lo necesitemos