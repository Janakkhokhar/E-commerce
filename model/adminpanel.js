let mongoose = require('mongoose');

let multer = require('multer')

let imagepath = "/upload/AdminImg";

let path = require('path');

let AdminSchema = mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: Number,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
    hobby: {
        type: Array,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    AdminImage: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        require: true
    },
    Created_date: {
        type: String,
        require: true
    },
    Updated_date: {
        type: String,
        require: true
    },

});

let imgstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "..", imagepath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
});

AdminSchema.statics.UploadAdminImg = multer({ storage: imgstorage }).single('AdminImage');
AdminSchema.statics.AdminModelPath = imagepath;

let adminpanel = mongoose.model('adminpanel', AdminSchema);
module.exports = adminpanel;

