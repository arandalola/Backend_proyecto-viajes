const connection=require('../config/sequelize');
const Sequelize=require('sequelize');

const destination=connection.define('destination',{//campos del modelo
    destination : Sequelize.STRING,
    // imagePath : Sequelize.STRING,
    // price : Sequelize.NUMBER,
    // discount : Sequelize.NUMBER,
});
destination.sync({
    logging:console.log,
    // force:true  no recomendaddo, se carga la tabla existente 
}).then(()=>{
    console.log('Destination model syncronized with destination table')
}).catch(err=>console.log('Error al sincronizar: ' + err))

module.exports=destination;//exporto el modelo