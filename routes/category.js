let express = require('express');

let routes = express.Router();

let catepanel = require('../model/catepanel');
let categorycontroller = require('../controller/categorycontroller');
let passport = require('passport');



routes.get('/add_category', passport.checkAuthenticated, categorycontroller.add_category);

routes.post('/CategoryDetalis', passport.checkAuthenticated, categorycontroller.CategoryDetalis);

routes.get('/view_category', passport.checkAuthenticated, categorycontroller.view_category);


routes.get('/activecate/:id', categorycontroller.activecate);

routes.get('/deactivecate/:id', categorycontroller.deactivecate);

routes.get('/deletecate/:id', categorycontroller.deletecate);

routes.get('/updatecategorydata/:id',categorycontroller.updatecategorydata);

routes.post('/EditCategoryData',categorycontroller.EditCategoryData);


//multipal Delete

routes.post('/DeleteAllcategory', categorycontroller.DeleteAllcategory);

//end



module.exports = routes