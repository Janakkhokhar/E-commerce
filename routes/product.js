let express = require('express');

let routes = express.Router();

let productpanel = require('../model/productpanel');

let productcontroller = require('../controller/productcontroller');

let passport = require('passport');


routes.get('/add_product', passport.checkAuthenticated,productpanel.UploadproductImg,productcontroller.add_product);

routes.post('/productData',passport.checkAuthenticated,productpanel.UploadproductImg,productcontroller.productData);

routes.get('/view_product',passport.checkAuthenticated,productcontroller.view_product);

routes.get('/activeproduct/:id',productcontroller.activeproduct);

routes.get('/deactiveproduct/:id',productcontroller.deactiveproduct);

routes.get('/deteleproduct/:id',productcontroller.deteleproduct);

routes.get('/updateproduct/:id',productcontroller.updateproduct);

routes.post('/Editproduct',productpanel.UploadproductImg,productcontroller.Editproduct);


//multipal Delete

routes.post('/DeleteAllProduct', productcontroller.DeleteAllProduct);

//end


module.exports = routes;