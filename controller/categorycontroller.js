const catepanel = require('../model/catepanel');
let adminpanel = require('../model/catepanel');





module.exports.add_category = async (req, res) => {
    return res.render("add_category");
}


module.exports.CategoryDetalis = async (req, res) => {
    // console.log(req.body);
    try {
        if (req.body) {
            req.body.isActive = true;
            req.body.Created_date = new Date().toLocaleDateString();
            req.body.Updated_date = new Date().toLocaleString();
            let data = await catepanel.create(req.body);
            return res.redirect("/admin/category/add_category");
        }
        else {
            console.log("data not found");
            return res.redirect('back');
        }
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }
}

module.exports.view_category = async (req, res) => {

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


    let data = await catepanel.find({
        $or: [
            { "category_name": { $regex: ".*" + search + ".*" } },
        ]
    })
        .limit(perpage)
        .skip(perpage * page);

    let totalCateData = await catepanel.find({
        $or: [
            { "category_name": { $regex: ".*" + search + ".*" } },
        ]
    }).countDocuments();


    return res.render("view_category", {
        Cate: data,
        admin: req.user,
        search: search,
        totalDocument: Math.ceil(totalCateData / perpage),
        currentpage: page,
    });
};


// active and deactive

module.exports.activecate = async (req, res) => {
    if (req.params.id) {
        let data = await catepanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deactivecate = async (req, res) => {
    if (req.params.id) {
        let data = await catepanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deletecate = async (req, res) => {

    try {
        let deleteRecord = await catepanel.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
            console.log("Record  delets successfully");
            return res.redirect("/admin/category/view_category");
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


// updata and edit data

module.exports.updatecategorydata = async (req, res) => {
    let record = await catepanel.findById(req.params.id);
    // let adminrecord = req.user;
    return res.render('updatecategorydata', {
        updatacate: record,
        // admin: adminrecord
    });
}

module.exports.EditCategoryData = async (req, res) => {
    try {
        let oldData = await catepanel.findById(req.body.oldId);

        await catepanel.findByIdAndUpdate(req.body.oldId, req.body);
        let adminData = await catepanel.findById(req.body.oldId);
        res.locals.user = adminData;

        return res.redirect("/admin/category/view_category");
    } catch (error) {
        console.log(error);
        return res.redirect('back');
    }

}

//end



//multipal Delete

module.exports.DeleteAllcategory = async (req, res) => {
    // console.log(req.body);
    await catepanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
    return res.redirect('back');
  }
  // End