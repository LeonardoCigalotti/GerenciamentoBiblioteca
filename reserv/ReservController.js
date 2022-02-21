const express = require("express");
const router = express.Router();
const Books = require("../books/Books");
const slugify = require("slugify");
const User = require("../users/User");
const Auth = require("../middleware/Auth");
const Reserv = require("./Reserv");

router.get("/admin/books/myreserv", Auth ,(req, res) => {
  Reserv.findAll({raw: true, where: {userId : req.session.user.id},order: [
    ['bookTitle', 'ASC']],
      include: [{model: Books}]
  }).then(reserv => {
      res.render("admin/reserv/myreserv",{reserv: reserv})
  });
});

router.get("/books/reserv/:id", Auth , (req, res) => {
  var id = req.params.id;
  Books.findByPk(id).then(books => {
      if(books != undefined){
        res.render("admin/reserv/reserv", {books: books})
      }else{
          res.redirect("/admin/books");
      }
  }).catch(err => {
      res.redirect("/admin/books");
  });
});

router.get("/books/update/reserv/:id", Auth , (req, res) => {
  var id = req.params.id;
  Reserv.findByPk(id).then(reserv => {
      if(reserv != undefined){
        res.render("admin/reserv/updateReserv", {reserv: reserv})
      }else{
          res.redirect("/admin/books/myreserv");
      }
  }).catch(err => {
      res.redirect("/admin/books/myreserv");
  });
});

router.post("/books/reserv/confirm", Auth, (req, res) =>{
  var dataInicio = new Date()
  dataInicio.getTime();
  var idBook = req.body.id;
  var user = req.session.user.id;
  var option = req.body.time;
  var title = req.body.title;

  if(option == '1'){
    var adicionar = moment().add(7, 'days');
    var Fim = adicionar.format("YYYY-MM-DD HH:mm:ss");
  }else if(option == '2'){
    var adicionar = moment().add(14, 'days');
    var Fim = adicionar.format("YYYY-MM-DD HH:mm:ss");
  }else if(option == '3'){
    var adicionar = moment().add(21, 'days');
    var Fim = adicionar.format("YYYY-MM-DD HH:mm:ss");
  }else if(option == '4'){
    var adicionar = moment().add(28, 'days');
    var Fim = adicionar.format("YYYY-MM-DD HH:mm:ss");
  }
  
  Reserv.create({
  bookId: idBook,
  bookTitle: title,
  userId: user,
  reserv: 'true',
  dataInicio: dataInicio,
  dataFim:  Fim
  }).then(() => {
  res.redirect("/admin/books/myreserv")
  });
});

router.post("/books/update/delete", Auth, (req, res) => {
  const id = parseInt(req.body.id);

  if(id != undefined){
    if(!isNaN(id)){
      Reserv.destroy({
        where: {id: id}
  
      }).then(() => {
        res.redirect("/admin/books/myreserv");
  
      })

    }else{ 
      res.redirect("//admin/books/myreserv")
    };
  }else{ 
    res.redirect("/admin/books/myreserv")
  }
});
module.exports = router;
