let mongoose = require('mongoose');

let categorySchema = mongoose.Schema({

    category_name :{
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

let catepanel = mongoose.model('Category',categorySchema);
module.exports = catepanel;