let catgeory = require('../model/catepanel');
let subcate = require('../model/subcatepanel');
let extrapanel = require('../model/extracate');
let brandpanel = require('../model/brandpanel');


module.exports.add_brand = async (req, res) => {
    let catData = await catgeory.find({});
    let subcatData = await subcate.find({});
    let extraData = await extrapanel.find({});

    return res.render('add_brand', {
        catRecord: catData,
        subcatRecord: subcatData,
        extraRecord: extraData,
    });
}

module.exports.brandData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleDateString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await brandpanel.create(req.body);
        }
        else {
            console.log("data not found");
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}


module.exports.view_brand = async (req, res) => {
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


    let data = await brandpanel.find({
        $or: [
            { "brand_name": { $regex: ".*" + search + ".*" } },
        ]
    }).populate("category_name").populate("extra_subcate_name").populate('extra_name')
        .limit(perpage)
        .skip(perpage * page).exec();

    let totalbrandData = await brandpanel.find({
        $or: [
            { "brand_name": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render("view_brand", {
        brandData: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalbrandData / perpage),
        currentpage: page,
    });
}


// ajax

module.exports.getextracatData = async (req, res) => {
    let extracatData = await extrapanel.find({ extra_subcate_name: req.body.subcategoryId });
    let optionData = `<option value=" ">--select--</option>`;
    extracatData.map((v, i) => {
        // console.log(v);
        optionData += `<option value="${v.id}">${v.extra_name}</option>`
    })
    return res.json(optionData);
}

//end


// active and deactive

module.exports.activebrand = async (req, res) => {
    if (req.params.id) {
        let data = await brandpanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deactivebrand = async (req, res) => {
    if (req.params.id) {
        let data = await brandpanel.findByIdAndUpdate(req.params.id, {
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


// delete Data

module.exports.deletebrand = async (req, res) => {

    try {
        let deleteRecord = await brandpanel.findByIdAndDelete(req.params.id);
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

module.exports.updatebrand = async (req, res) => {
    try {
        if (req.params.id) {
            let brand = await brandpanel.findById(req.params.id).populate('category_name').populate('extra_subcate_name').populate('extra_name').exec();
            if (brand) {
                return res.render('updatebrand', {
                    updatabrand: brand,
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

module.exports.Editbrand = async (req, res) => {
    try {
        let oldData = await brandpanel.findById(req.body.oldId);

        await brandpanel.findByIdAndUpdate(req.body.oldId, req.body);
        let adminData = await brandpanel.findById(req.body.oldId);
        res.locals.user = adminData;

        return res.redirect("/admin/brand/view_brand");
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }

}


//end



//multipal Delete

module.exports.DeleteAllBrand = async (req, res) => {
    // console.log(req.body);
    await brandpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
  }
  // End
