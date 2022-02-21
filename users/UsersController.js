const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');

router.get("/users/createaccount", (req, res) => {
      res.render("users/create");
});

router.post("/users/create", (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where: {email : email}}).then(user => {
        if(user == undefined){
        
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
        
            User.create({
                id: User.id,
                name : name,
                email : email,
                password : hash,
                role: 0
            }).then(() =>{
                res.redirect("/");
            }).catch((error) =>{
                res.redirect("/");
            });   
        }else{
            res.send("Email cadastrado");
        } 
    })
});

router.post("/authenticate", (req, res) => {

    var email = req.body.email;
    var password = req.body.password;

    User.findOne({where:{email: email}}).then(user => {
        if(user != undefined){ // Se existe um usuário com esse e-mail
            // Validar senha
            var correct = bcrypt.compareSync(password,user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
                res.redirect("/admin/books");
            }else{
                res.send("Senha incorreta"); 
            }

        }else{
            res.send("Email ou senha incorreta");
        }
    });

});

router.get("/logout", (req, res) =>{
    req.session.user = undefined;
    res.redirect("/");
});

router.post("/users/delete", (req, res) => {
    const id = req.body.id;
  
    User.destroy({ where: {id: id}}).then(() => {
      res.redirect("/users");
    }).catch(err => {
      res.redirect("/users");
    });
  });

router.get("/users/edit/:id", (req, res) => {
    const id = req.params.id;
  
    User.findOne({where: {id: id}}).then(user => {
      res.render("admin/usuario/edit", {user: user});
  
    }).catch(err => {
      res.redirect("/users");
    })
});

router.post("/users/update", (req, res) => {
    const { name, email, password, id } = req.body;
    let salt = bcrypt.genSaltSync(10);
    User.findOne({ where: {email: email}}).then(userRes => {
      if(userRes != undefined){
        userId = userRes.id;
  
        if(userId != id){
          res.redirect(`/users/edit/${id}`);
        } else {
          if (password == ""){
            User.update({
              name: name,
              email: email},{
                
              where: {id: id}
    
            }).then(() => {
              res.redirect("/users");
            }).catch(err => {
              res.redirect("/");
            });
          } else {
    
            if(password){
              let hash =  bcrypt.hashSync(password, salt);
              User.update({
                name: name,
                email: email,
                password: hash},{
                  
                where: {id: id}
      
              }).then(() => {
                res.redirect("/users");
      
              }).catch(err => {
                res.redirect("/");
      
              });
            } else {
              res.redirect(`/users/edit/${id}`);
            }
        };
        }
      } else {
        if (password == ""){
          User.update({
            name: name,
            email: email},{
              
            where: {id: id}
  
          }).then(() => {
            res.redirect("/users");
  
          }).catch(err => {
            res.redirect("/");
          });
        } else {
  
          if(password){
            let hash =  bcrypt.hashSync(password, salt);
    
            User.update({
              name: name,
              email: email,
              password: hash},{
                
              where: {id: id}
    
            }).then(() => {
              res.redirect("/users");
    
            }).catch(err => {
              res.redirect("/");
    
            });
          } else {
            res.redirect("/");
          }
      };
      }
    }).catch(err => {
      res.redirect("/");
    });
  });

router.get("/users", (req, res) => {
    User.findAll({raw: true}).then(users => {
      res.render("admin/usuario", {
        users: users
      });
    });
});

module.exports = router;