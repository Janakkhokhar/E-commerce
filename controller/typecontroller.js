let category = require('../model/catepanel');
let subcate = require('../model/subcatepanel');
let extracate = require('../model/extracate');
let brandcate = require('../model/brandpanel');
let typecate = require('../model/typepanel');

module.exports.add_type = async (req, res) => {
    let cateData = await category.find({});
    let subcateData = await subcate.find({});
    let extraData = await extracate.find({});
    return res.render('add_type', {
        catRecord: cateData,
        subcatRecord: subcateData,
        extraRecord: extraData,
    });
}

module.exports.typeData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleDateString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await typecate.create(req.body);
        }
        else {
            console.log("data not found");
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}


module.exports.view_type = async (req, res) => {
    // searching
    let search = '';
    if (req.query.search) {
        search = req.query.search;
    }
    //end

    // pageingtion
    if (req.query.page) {
        page = req.query.page;
    }
    else {
        page = 0;
    }
    let perpage = 6;
    //end


    let data = await typecate.find({
        $or: [
            { "type_name": { $regex: ".*" + search + ".*" } },
        ]
    }).populate("category_name").populate("extra_subcate_name").populate('extra_name')
        .limit(perpage)
        .skip(perpage * page).exec();

    let totaltypeData = await typecate.find({
        $or: [
            { "type_name": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render("view_type", {
        typeData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totaltypeData / perpage),
        currentpage: page,
    });
}

//ajax

module.exports.gettypecatData = async (req, res) => {
    // console.log(req.body);
    let brandData = await brandcate.find({ category_name: req.body.categoryId, extra_subcate_name: req.body.subcategoryId, extra_name: req.body.extracategoryId });
    let typeData = await typecate.find({ category_name: req.body.categoryId, extra_subcate_name: req.body.subcategoryId, extra_name: req.body.extracategoryId });

    // console.log(brandData);
    // console.log(typeData);
    return res.render('ajax_brandtype', {
        brandRecord: brandData,
        typeRecord: typeData
    })


}

//end


// active and deactive

module.exports.activetype = async (req, res) => {
    if (req.params.id) {
        let data = await typecate.findByIdAndUpdate(req.params.id, {
            isActive: false,
        });
        if (data) {
            return res.redirect("back");
        } else {
            console.log("Admin not Deactive");
            return res.redirect("back");
        }
    } else {
        console.log("Admin not found");
        return res.redirect("back");
    }
};

module.exports.deactivetype = async (req, res) => {
    if (req.params.id) {
        let data = await typecate.findByIdAndUpdate(req.params.id, {
            isActive: true,
        });
        if (data) {
            return res.redirect("back");
        } else {
            console.log("Admin not active");
            return res.redirect("back");
        }
    } else {
        console.log("Admin not found");
        return res.redirect("back");
    }
};

//end


// delete  Data

module.exports.deletetype = async (req, res) => {

    try {
        let deleteRecord = await typecate.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
            console.log("Record  delets successfully");
            return res.redirect("/admin/brand/view_brand");
        } else {
            console.log("Record not a delete");
            return res.redirect("back");
        }
    }
    catch (error) {
        console.log(error);
        return res.redirect("back");
    }
};


//end



// updata and Edit data

module.exports.updatetype = async (req, res) => {
    try {
        if (req.params.id) {
            let type = await typecate.findById(req.params.id).populate('category_name').populate('extra_subcate_name').populate('extra_name').exec();
            if (type) {
                return res.render('updatetype', {
                    updatatype: type,
                })
            }
            else {
                console.log("Record Updata");
            }
        }
        else {
            console.log("record not Found");
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}

module.exports.Edittype = async (req, res) => {
    try {
        let oldData = await typecate.findById(req.body.oldId);

        await typecate.findByIdAndUpdate(req.body.oldId, req.body);
        let adminData = await typecate.findById(req.body.oldId);
        res.locals.user = adminData;

        return res.redirect("/admin/type/view_type");
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }

}


//end




//multipal Delete

module.exports.DeleteAllType = async (req, res) => {
    // console.log(req.body);
    await typecate.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
  }
  // End