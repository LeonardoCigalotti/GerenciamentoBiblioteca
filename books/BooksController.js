const express = require("express");
const router = express.Router();
const Books = require("./Books");
const slugify = require("slugify");
const User = require("../users/User");
const Auth = require("../middleware/Auth");
const Reserv = require("../reserv/Reserv");

router.get("/admin/books", Auth, (req, res) => {
  Books.findAll({raw: true, order: [
    ['title', 'ASC']]}).then(books => {
    res.render("admin/books/books", {books : books });
  });
});

router.get("/admin/mybooks", Auth, (req, res) => {
  Books.findAll({raw: true, where: {userId : req.session.user.id},order: [
    ['title', 'ASC']]}).then(books => {
    res.render("admin/books/mybooks", {books : books });
  });
});

router.get("/admin/books/new", Auth, (req, res) => {

    res.render('admin/books/new')
});

router.post("/books/save", Auth,  (req, res) => {
  const { title, body} = req.body;
  var user = req.session.user.id;

  Books.create({
    title: title,
    slug: slugify(title, {lower: true}),
    body: body,
    userId: user
  }).then(() => {
    res.redirect('/admin/books');
  });
});

router.post("/books/delete", Auth, (req, res) => {
  const id = parseInt(req.body.id);

  if(id != undefined){
    if(!isNaN(id)){
      Books.destroy({
        where: {id: id}
  
      }).then(() => {
        res.redirect("/admin/books");
  
      })

    }else{ 
      res.redirect("/admin/books")
    };
  }else{ 
    res.redirect("/admin/books")
  }
});

router.get("/books/edit/:id", Auth , (req, res) => {
  var id = req.params.id;

  Books.findByPk(id).then(books => {
      if(books != undefined){
          res.render("admin/books/edit", {books:books});
      }else{
          res.redirect("/admin/books");
      }
  }).catch(err => {
      res.redirect("/admin/books");
  });
});

router.post("/books/update", Auth, (req, res) => {
  const { id, title, body} = req.body;

  Books.update({
    title: title, 
    body: body,
    slug: slugify(title, {lower: true})}, { 
    where: {
      id: id
    } 
  }).then(() => {
    res.redirect('/admin/books')
  }).catch(err => {
    res.redirect('/admin/books');
  })
});

module.exports = router;