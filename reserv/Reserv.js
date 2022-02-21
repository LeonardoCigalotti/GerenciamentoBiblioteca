const Sequelize = require("sequelize");
const conn = require("../database/database");
const User = require("../users/User");
const Books = require("../books/Books");

const Reserv = conn.define('reservs', {
  reserv: {
    type: Sequelize.STRING
  },
  dataInicio: {
    type: 'DATETIME'
  },
  dataFim: {
    type: 'DATETIME'
  },
  bookTitle:{
    type: Sequelize.STRING
  }
});

User.hasMany(Reserv); 
Reserv.belongsTo(User);
Reserv.belongsTo(Books);

Reserv.sync({force: false});

module.exports = Reserv;
