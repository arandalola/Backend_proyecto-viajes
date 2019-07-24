/*LIBRERIA ORM(Object Relational Mapping) DE MYSQL */
const Sequelize=require('sequelize')//llamo a la librería

const connection=new Sequelize('webtravelagency', 'root', '',{ //le indico a que BD, con usuario y contraseña si la tengo, me quiero conectar.
    host:'localhost',//configuración de la base de datos
    dialect:'mysql',
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
connection.authenticate()//devuelve una promesa

.then(()=>console.log('MySQL Conection has been established successfully.'))
.catch(err => console.log('Unable to connect to the database:', + err));

module.exports=connection;//exporto el tipo de conexión que he configurado

