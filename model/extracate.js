let mongoose = require('mongoose');

let ExtracategorySchema = mongoose.Schema({

    category_name :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        require : true
    },
    extra_subcate_name :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "SubCategory",
        require : true
    },
    extra_name :{
        type : String,
        require : true
    },
    isActive : {
        type : Boolean,
        required : true
    },
    Created_date : {
        type : String,
        required : true
    },
    Updated_date : {
        type : String,
        required : true
    },
});

let Extracate = mongoose.model('ExtraCategory',ExtracategorySchema);
module.exports = Extracate;