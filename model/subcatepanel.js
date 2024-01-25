let mongoose = require('mongoose');

let subcategorySchema = mongoose.Schema({

    category_name :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Category",
        require : true
    },
    subcate_name :{
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

let subcatepanel = mongoose.model('SubCategory',subcategorySchema);
module.exports = subcatepanel;