let express = require('express');

let routes = express.Router();

let brandpanel = require('../model/brandpanel');
let brandcontroller = require('../controller/brandcontroller');
let passport = require('passport');

routes.get('/add_brand', passport.checkAuthenticated, brandcontroller.add_brand);

routes.post('/brandData', passport.checkAuthenticated, brandcontroller.brandData);

routes.get('/view_brand', passport.checkAuthenticated, brandcontroller.view_brand);


routes.get('/activebrand/:id', brandcontroller.activebrand);

routes.get('/deactivebrand/:id', brandcontroller.deactivebrand);

routes.get('/deletebrand/:id', brandcontroller.deletebrand);


routes.get('/updatebrand/:id', brandcontroller.updatebrand);

routes.post('/Editbrand', brandcontroller.Editbrand);


//ajax

routes.post('/getextracatData', passport.checkAuthenticated, brandcontroller.getextracatData)

//end


//multipal Delete

routes.post('/DeleteAllBrand', brandcontroller.DeleteAllBrand);

//end


module.exports = routes;