
let mongoose = require('mongoose');

let multer = require('multer');

let singleImg = "/upload/productImage/singleImage";

let multiImage = "/upload/productImage/multipalImage";

let path = require('path');

let productSchema = mongoose.Schema({

    category_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        require: true
    },
    extra_subcate_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        require: true
    },
    extra_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExtraCategory",
        require: true
    },
    brand_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brandCategory",
        require: true
    },
    type_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TypeCategory",
        require: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    oldprice: {
        type: Number,
        require: true
    },
    color: {
        type: Array,
        require: true
    },
    size: {
        type: Array,
        require: true
    },
    description: {
        type: String,
        required: true
    },
    Product_single_image: {
        type: String,
        required: true
    },
    Product_multi_image: {
        type: Array,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    Created_date: {
        type: String,
        required: true
    },
    Updated_date: {
        type: String,
        required: true
    },

});

let imgstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        if (file.fieldname == 'Product_single_image') {
            cb(null, path.join(__dirname, "..", singleImg));
        }
        else {
            cb(null, path.join(__dirname, "..", multiImage));

        }
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Math.random() * 10000000);
    }
});

productSchema.statics.UploadproductImg = multer({ storage: imgstorage }).fields([{ name: "Product_single_image", maxCount: 1 },
{ name: "Product_multi_image", maxCount: 5 }])


productSchema.statics.singleImagModel = singleImg;
productSchema.statics.multiImageModel = multiImage;

let productpanel = mongoose.model('productpanel', productSchema);
module.exports = productpanel;

