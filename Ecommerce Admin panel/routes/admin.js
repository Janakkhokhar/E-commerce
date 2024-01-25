let express = require('express');

let routes = express.Router();

let adminpanel = require('../model/adminpanel');

let admincontroller = require('../controller/admincontroller');

let passport = require('passport');

routes.get("/", async (req, res) => {
  if (req.user) {
    return res.redirect("/admin/dashboard");
  }
  return res.render("login");
});


routes.get('/dashboard', passport.checkAuthenticated, admincontroller.dashboard);

routes.get('/add_admin', passport.checkAuthenticated, admincontroller.add_admin);

routes.get('/view_admin', passport.checkAuthenticated, admincontroller.view_admin)

routes.post('/AdminDetails', passport.checkAuthenticated, adminpanel.UploadAdminImg, admincontroller.AdminDetails);

routes.get('/activedata/:id', admincontroller.activedata);

routes.get('/deactivedata/:id', admincontroller.deactivedata);

routes.get('/delelerecord/:id', admincontroller.delelerecord);

routes.get('/updateadmindata/:id', admincontroller.updateadmindata);

routes.post('/EditAdminData', adminpanel.UploadAdminImg, admincontroller.EditAdminData);


//profile

routes.get('/profile', passport.checkAuthenticated, admincontroller.profile);

routes.post('/Editprofile', adminpanel.UploadAdminImg, admincontroller.Editprofile);

//end




// login route

routes.post('/checklogin', passport.authenticate("local", { failureRedirect: "/admin/" }), admincontroller.checklogin);


//end


// forgot password

routes.get("/mailpage", (req, res) => {
  return res.render("forgotpass/mainpage");
});


routes.post('/checkmail', admincontroller.checkmail);

routes.get('/otppage',(req,res)=>{
  return res.render('forgotpass/otppage');
})

routes.post('/verifyotp',admincontroller.verifyotp);

routes.get('/newpassword', (req, res)=>{
  res.render('forgotpass/newpassword');
});

routes.post('/changepassword',admincontroller.changepassword);

//end



//multipal Delete

routes.post('/DeleteAllRecord', admincontroller.DeleteAllRecord);

//end





routes.use('/category', passport.checkAuthenticated, require('./category'));

routes.use('/subcate', passport.checkAuthenticated, require('./subcate'));

routes.use('/extra', passport.checkAuthenticated, require('./extra'));

routes.use('/brand', passport.checkAuthenticated, require('./brand'));

routes.use('/type', passport.checkAuthenticated, require('./type'));

routes.use('/product', passport.checkAuthenticated, require('./product'));


module.exports = routes;