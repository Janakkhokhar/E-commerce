let express = require('express');

let routes = express.Router();

let typepanel = require('../model/typepanel');

let typecontroller = require('../controller/typecontroller');

let passport = require('passport');


routes.get('/add_type', passport.checkAuthenticated, typecontroller.add_type);

routes.post('/typeData', passport.checkAuthenticated, typecontroller.typeData);

routes.get('/view_type', passport.checkAuthenticated, typecontroller.view_type);


routes.get('/activetype/:id', typecontroller.activetype);

routes.get('/deactivetype/:id', typecontroller.deactivetype);

routes.get('/deletetype/:id', typecontroller.deletetype);


routes.get('/updatetype/:id', typecontroller.updatetype);

routes.post('/Edittype', typecontroller.Edittype);


//ajax

routes.post('/gettypecatData', passport.checkAuthenticated,typecontroller.gettypecatData);

//end


//multipal Delete

routes.post('/DeleteAllType', typecontroller.DeleteAllType);

//end

module.exports = routes;