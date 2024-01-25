let express = require('express');

let routes = express.Router();

let extracate = require('../model/extracate');

let extracontroller = require('../controller/extracatecontroller');

let passport = require('passport');

routes.get('/add_extracategory', passport.checkAuthenticated, extracontroller.add_extracategory);

routes.post('/ExtraCategoryData', passport.checkAuthenticated, extracontroller.ExtraCategoryData);

routes.get('/view_extracategory', passport.checkAuthenticated, extracontroller.view_extracategory);


routes.get('/activeExtra/:id', extracontroller.activeExtra);

routes.get('/deactiveExtra/:id', extracontroller.deactiveExtra);

routes.get('/deleteExtra/:id', extracontroller.deleteExtra);


routes.get('/updateextracate/:id',extracontroller.updateextracate);

routes.post('/Editextra',extracontroller.Editextra);



// ajax
routes.post('/getsubcatData', passport.checkAuthenticated, extracontroller.getsubcatData);

//end



//multipal Delete

routes.post('/DeleteAllExtra', extracontroller.DeleteAllExtra);

//end





module.exports = routes;