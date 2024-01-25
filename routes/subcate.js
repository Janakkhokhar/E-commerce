let express = require('express');

let routes = express.Router();

let subcatepanel = require('../model/subcatepanel');

let subcatecontroller = require('../controller/subcategorycontroller');

let passport = require('passport');

routes.get('/add_subcategory', passport.checkAuthenticated,subcatecontroller.add_subcategory);

routes.post('/insertsubcateData', passport.checkAuthenticated,subcatecontroller.insertsubcateData);

routes.get('/view_subcategory',passport.checkAuthenticated,subcatecontroller.view_subcategory);


routes.get('/activesubcate/:id', subcatecontroller.activesubcate);

routes.get('/deactivesubcate/:id', subcatecontroller.deactivesubcate);

routes.get('/deletesubcate/:id', subcatecontroller.deletesubcate);

routes.get('/updatesubcat/:id',subcatecontroller.updatesubcat);

routes.post('/Editsubcat',subcatecontroller.Editsubcat);


//multipal Delete

routes.post('/DeleteAllsubcat', subcatecontroller.DeleteAllsubcat);

//end

module.exports = routes