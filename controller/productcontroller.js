let category = require('../model/catepanel');
let subcate = require('../model/subcatepanel');
let extracate = require('../model/extracate');
let brandcate = require('../model/brandpanel');
let typecate = require('../model/typepanel');
let productpanel = require('../model/productpanel');
let path = require('path');
let fs = require('fs');


module.exports.add_product = async (req, res) => {
  let cateData = await category.find({});
  let subcateData = await subcate.find({});
  let extraData = await extracate.find({});
  let brandData = await brandcate.find({});
  let typeData = await typecate.find({});
  return res.render('add_product', {
    catRecord: cateData,
    subcatRecord: subcateData,
    extraRecord: extraData,
    brandRecord: brandData,
    typeRecord: typeData
  });
}

module.exports.productData = async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);
  try {
    let Singleimgpath = '';
    let Multiimgpath = [];

    if (req.files) {
      Singleimgpath = await productpanel.singleImagModel + '/' + req.files.Product_single_image[0].filename;
      // console.log(Singleimgpath);
    }
    for (var i = 0; i < req.files.Product_multi_image.length; i++) {
      Multiimgpath.push(productpanel.multiImageModel + '/' + req.files.Product_multi_image[i].filename);

    }
    // console.log(Multiimgpath);
    req.body.Product_single_image = Singleimgpath;
    req.body.Product_multi_image = Multiimgpath;
    req.body.isActive = true;
    req.body.Created_date = new Date().toLocaleDateString();
    req.body.Updated_date = new Date().toLocaleString();
    let data = await productpanel.create(req.body);

  } catch (error) {
    console.log(error);
  }
  return res.redirect('back');
}


module.exports.view_product = async (req, res) => {
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
  let perpage = 3;
  //end


  let data = await productpanel.find({
    $or: [
      { "title": { $regex: ".*" + search + ".*" } },
    ]
  }).populate("category_name").populate("extra_subcate_name").populate('extra_name').populate('brand_name').populate('type_name')
    .limit(perpage)
    .skip(perpage * page).exec();

  let totalProductData = await productpanel.find({
    $or: [
      { "title": { $regex: ".*" + search + ".*" } },
    ]
  }).countDocuments();


  return res.render("view_product", {
    PData: data,
    admin: req.user,
    search: search,
    totalDocument: Math.ceil(totalProductData / perpage),
    currentpage: page,
  });
};


// active and deactive

module.exports.activeproduct = async (req, res) => {
  if (req.params.id) {
    let data = await productpanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deactiveproduct = async (req, res) => {
  if (req.params.id) {
    let data = await productpanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deteleproduct = async (req, res) => {

  try {
    let data = await productpanel.findById(req.params.id);
    // console.log(data);
    if (data.Product_single_image) {
      fullPath = path.join(__dirname, '..', data.Product_single_image);
      fs.unlinkSync(fullPath);
    }
    for (var i = 0; i < data.Product_multi_image.length; i++) {
      let multifullPath = path.join(__dirname, '..', data.Product_multi_image[i]);
      try {
        await fs.unlinkSync(multifullPath);

      } catch (error) {
        console.log(error);
      }
    }
    let deleteData = await productpanel.findByIdAndDelete(req.params.id);

    if (deleteData) {
      console.log("Record And Image Delete Successfully");
      return res.redirect("/admin/product/view_product")
    }
    else {
      console.log("product Data Not Delete ");
      return res.redirect('back');
    }

  } catch (error) {
    console.log(error);
    return res.redirect("back");
  }
};

//end


// update and Edit Product Data

module.exports.updateproduct = async (req, res) => {
  try {
    let productRecord = await productpanel.findById(req.params.id).populate('category_name').populate('extra_subcate_name').populate('extra_name').populate('brand_name').populate('type_name').exec();
    // console.log(productRecord);

    let cateData = await category.find({});
    let subcateData = await subcate.find({});
    let extraData = await extracate.find({});
    let brandData = await brandcate.find({});
    let typeData = await typecate.find({});
    let productData = await productpanel.find({});
    return res.render('updateproduct', {
      cate: cateData,
      subcat: subcateData,
      extra: extraData,
      brand: brandData,
      type: typeData,
      ProductUpdateRecord: productData
    });
  } catch (error) {
    console.log(error);
    return res.redirect("back")
  }
}


module.exports.Editproduct = async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);
  //   console.log(req.files.Product_single_image);
  //   console.log(req.files.Product_multi_image[0]);

  try {
    if (req.files.Product_single_image) {
      let oldData = await productpanel.findById(req.body.EditId);
      if (oldData) {
        if (oldData.Product_single_image) {
          let fullPath = path.join(__dirname, '..', oldData.Product_single_image);
          await fs.unlinkSync(fullPath);
        }
        if (req.files.Product_multi_image) {
          let multiImg = [];
          let oldpro = await productpanel.findById(req.body.EditId);

          for (var m = 0; m < oldpro.Product_multi_image.length; m++) {
            multiImg.push(oldpro.Product_multi_image[m]);
          }
          for (var i = 0; i < req.files.Product_multi_image.length; i++) {
            multiImg.push(product.prmulimg + "/" + req.files.Product_multi_image[i].filename);
          }
          req.body.Product_multi_image = multiImg;
        }
        var productImagePath = product.prsingleimg + '/' + req.files.Product_single_image[0].filename;
        req.body.Product_single_image = productImagePath;


        let ad = await productpanel.findByIdAndUpdate(req.body.EditId, req.body);
        if (ad) {
          console.log("Record & Image Update Succesfully");
          return res.redirect('/admin/product/view_product');
        }
        else {
          console.log("Record Not Updated");
          return res.redirect('/admin/product/view_product');
        }
      }
      else {
        console.log("Record Not Updated");
        return res.redirect('/admin/product/view_product');
      }
    }
    else {
      let oldData = await productpanel.findById(req.body.EditId);
      if (oldData) {
        if (req.files.Product_multi_image) {
          let multiImg = [];
          let oldpro = await productpanel.findById(req.body.EditId);

          for (var m = 0; m < oldpro.Product_multi_image.length; m++) {
            multiImg.push(oldpro.Product_multi_image[m]);
          }
          for (var i = 0; i < req.files.Product_multi_image.length; i++) {
            multiImg.push(product.prmulimg + "/" + req.files.Product_multi_image[i].filename);
          }
          req.body.Product_multi_image = multiImg;
        }
        req.body.ProductImage = oldData.ProductImage;


        let ad = await productpanel.findByIdAndUpdate(req.body.EditId, req.body);
        if (ad) {
          console.log("Record & Image Update Succesfully");
          return res.redirect('/admin/product/view_product');
        }
        else {
          console.log("Record Not Updated");
          return res.redirect('/admin/product/view_product');
        }
      }
      else {
        console.log("Record Not Updated");
        return res.redirect('/admin/product/view_product');
      }
    }
  }
  catch (error) {
    console.log(error);
    return res.redirect('/admin/product/view_product');
  }
}





//end




//multipal Delete

module.exports.DeleteAllProduct = async (req, res) => {
  // console.log(req.body);
  await productpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
  return res.redirect('back');
}
// End