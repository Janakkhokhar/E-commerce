let extracate = require('../model/extracate');
let catepanel = require('../model/catepanel');
let subcatepanel = require('../model/subcatepanel');


module.exports.add_extracategory = async (req, res) => {
    let cateData = await catepanel.find({});
    let subcateData = await subcatepanel.find({});
    return res.render("add_extracategory", {
        catRecord: cateData,
        subcatRecord: subcateData
    });
}

module.exports.ExtraCategoryData = async (req, res) => {
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleDateString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await extracate.create(req.body);
        }
        else {
            console.log("data not found");
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back');
}


module.exports.view_extracategory = async (req, res) => {
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


    let data = await extracate.find({
        $or: [
            { "extra_name": { $regex: ".*" + search + ".*" } },
        ]
    }).populate("category_name").populate("extra_subcate_name")
        .limit(perpage)
        .skip(perpage * page).exec();

    let totalCateData = await extracate.find({
        $or: [
            { "extra_name": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    // console.log(data);
    return res.render("view_extracategory", {
        extra: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalCateData / perpage),
        currentpage: page,
    });
}

//ajax

module.exports.getsubcatData = async (req, res) => {
    let subcatData = await subcatepanel.find({ category_name: req.body.categoryId });
    
    let optionData = `<option value=" ">--select--</option>`;
    subcatData.map((v, i) => {
        optionData += `<option value="${v.id}">${v.subcate_name}</option>`
    })
    return res.json(optionData);
}

//end


// active and deactive

module.exports.activeExtra = async (req, res) => {
    if (req.params.id) {
        let data = await extracate.findByIdAndUpdate(req.params.id, {
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

module.exports.deactiveExtra = async (req, res) => {
    if (req.params.id) {
        let data = await extracate.findByIdAndUpdate(req.params.id, {
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

module.exports.deleteExtra = async (req, res) => {

    try {
        let deleteRecord = await extracate.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
            console.log("Record  delets successfully");
            return res.redirect("/admin/extra/view_extracategory");
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

module.exports.updateextracate = async (req, res) => {
    try {
        if (req.params.id) {
            let extracategory = await extracate.findById(req.params.id).populate('category_name').populate('extra_subcate_name').exec();
            if (extracategory) {
                return res.render('updateextracate', {
                    updataextra: extracategory,
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

module.exports.Editextra = async (req, res) => {
    try {
        let oldData = await extracate.findById(req.body.oldId);

        await extracate.findByIdAndUpdate(req.body.oldId, req.body);
        let adminData = await extracate.findById(req.body.oldId);
        res.locals.user = adminData;

        return res.redirect("/admin/extra/view_extracategory");
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }

}


//end



//multipal Delete

module.exports.DeleteAllExtra = async (req, res) => {
    // console.log(req.body);
    await extracate.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
  }
  // End