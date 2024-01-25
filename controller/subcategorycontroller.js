let subcatepanel = require('../model/subcatepanel');
let catepanel = require('../model/catepanel');

module.exports.add_subcategory = async (req, res) => {
    let catData = await catepanel.find({})
    return res.render('add_subcategory', {
        catRecord: catData
    });
};

module.exports.insertsubcateData = async (req, res) => {
    //  console.log(req.body);  
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await subcatepanel.create(req.body);
        }
        else {
            console.log("data not found");
        }
    } catch (error) {
        console.log(error);
    }
    return res.redirect('back')
}


module.exports.view_subcategory = async (req, res) => {
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


    let data = await subcatepanel.find({
        $or: [
            { "subcate_name": { $regex: ".*" + search + ".*" } },
        ]
    }).populate("category_name")
        .limit(perpage)
        .skip(perpage * page).exec();

    let totalsubCateData = await subcatepanel.find({
        $or: [
            { "subcate_name": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();

    return res.render("view_subcategory", {
        subCate: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalsubCateData / perpage),
        currentpage: page,
    });
}


// active and deactive

module.exports.activesubcate = async (req, res) => {
    if (req.params.id) {
        let data = await subcatepanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deactivesubcate = async (req, res) => {
    if (req.params.id) {
        let data = await subcatepanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deletesubcate = async (req, res) => {

    try {
        let deleteRecord = await subcatepanel.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
            console.log("Record  delets successfully");
            return res.redirect("/admin/subcate/view_subcategory");
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

module.exports.updatesubcat = async (req, res) => {
    try {
        if (req.params.id) {
            let subcategory = await subcatepanel.findById(req.params.id).populate('category_name').exec();
            if (subcategory) {
                return res.render('updatesubcat', {
                    updatasub: subcategory,
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

module.exports.Editsubcat = async (req, res) => {
    try {
        let oldData = await subcatepanel.findById(req.body.oldId);

        await subcatepanel.findByIdAndUpdate(req.body.oldId, req.body);
        let adminData = await subcatepanel.findById(req.body.oldId);
        res.locals.user = adminData;

        return res.redirect("/admin/subcate/view_subcategory");
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }

}


//end



//multipal Delete

module.exports.DeleteAllsubcat = async (req, res) => {
    // console.log(req.body);
    await subcatepanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
  }
  // End