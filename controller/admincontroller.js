let adminpanel = require('../model/adminpanel');

let nodemailer = require('nodemailer');

let path = require('path');

let fs = require('fs');


module.exports.dashboard = async (req, res) => {
  return res.render('dashboard')
};


module.exports.add_admin = async (req, res) => {
  if (req.user == undefined) {
    return res.redirect("/admin/");
  }
  return res.render('add_admin', {
    admin: req.user,
  })
};


module.exports.AdminDetails = async (req, res) => {
  try {
    let ImagePath = "";
    if (req.file) {
      ImagePath = adminpanel.AdminModelPath + "/" + req.file.filename;
    } else {
      console.log("Image not found");
      return res.redirect("back");
    }
    if (req.body) {
      req.body.AdminImage = ImagePath;
      req.body.isActive = true;
      req.body.Created_date = new Date().toLocaleDateString();
      req.body.Updated_date = new Date().toLocaleString();
      let data = await adminpanel.create(req.body);
    } else {
      console.log("data not found");
    }
  } catch (err) {
    console.log("something worng", err);
  }
  return res.redirect("back");
};


module.exports.view_admin = async (req, res) => {
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


  let data = await adminpanel.find({
    $or: [
      { "name": { $regex: ".*" + search + ".*" } },
      { "email": { $regex: ".*" + search + ".*" } }
    ]
  })
    .limit(perpage)
    .skip(perpage * page);

  let totalAdminData = await adminpanel.find({
    $or: [
      { "name": { $regex: ".*" + search + ".*" } },
      { "email": { $regex: ".*" + search + ".*" } }
    ]
  }).countDocuments();


  return res.render("view_admin", {
    AData: data,
    admin: req.user,
    search: search,
    totalDocument: Math.ceil(totalAdminData / perpage),
    currentpage: page,
  });
};


// active and deactive

module.exports.activedata = async (req, res) => {
  if (req.params.id) {
    let data = await adminpanel.findByIdAndUpdate(req.params.id, {
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

module.exports.deactivedata = async (req, res) => {
  if (req.params.id) {
    let data = await adminpanel.findByIdAndUpdate(req.params.id, {
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

module.exports.delelerecord = async (req, res) => {

  try {
    let olddata = await adminpanel.findById(req.params.id);
    if (olddata) {
      let oldImage = olddata.AdminImage;
      if (oldImage) {
        let fullpath = path.join(__dirname, ".." + olddata.AdminImage);
        let dImage = await fs.unlinkSync(fullpath);
        let deleteRecord = await adminpanel.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
          console.log("Record and image delets successfully");
          return res.redirect("/admin/view_admin");
        } else {
          console.log("Record delete successfully");
          return res.redirect("back");
        }
      } else {
        let deleteRecord = await adminpanel.findByIdAndDelete(req.params.id);
        if (deleteRecord) {
          console.log("Record and image delets successfully");
          return res.redirect("back");
        } else {
          console.log("Record delete successfully");
          return res.redirect("back");
        }
      }
    } else {
      console.log("Record not found");
      return res.redirect("back");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("back");
  }
};

//end



//Updata Data

module.exports.updateadmindata = async (req, res) => {
  try {
    let Record = await adminpanel.findById(req.params.id);
    let adminrecord = req.user;
    return res.render('updateadmindata', {
      UpAdmin: Record,
      admin: adminrecord
    });

  } catch (error) {
    console.log(error);
  }
}

// Edit Data

module.exports.EditAdminData = async (req, res) => {
  try {
    let oldData = await adminpanel.findById(req.body.oldId);
    if (req.file) {
      if (oldData.AdminImage) {
        let fullPath = path.join(__dirname, ".." + oldData.AdminImage);
        await fs.unlinkSync(fullPath);
      }
      let imagePath = "";
      imagePath = adminpanel.AdminModelPath + "/" + req.file.filename;
      req.body.AdminImage = imagePath;
      res.locals.user.AdminImage = imagePath;
    } else {
      req.body.AdminImage = oldData.AdminImage;
    }

    await adminpanel.findByIdAndUpdate(req.body.oldId, req.body);
    let adminData = await adminpanel.findById(req.body.oldId);
    res.locals.user = adminData;
    return res.redirect("/admin/view_admin");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

//end


// login page

module.exports.checklogin = async (req, res) => {
  return res.redirect('/admin/dashboard');
}

//end


// forgot password 

module.exports.checkmail = async (req, res) => {
  // console.log(req.body);
  try {
    let CheckEmailData = await adminpanel.findOne({ email: req.body.email });
    if (CheckEmailData) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "janakkhokhar28@gmail.com",
          pass: "fcosdzxztqdbmtqy",
        },
      });

      let OTP = Math.round(Math.random() * 10000);
      res.cookie('otp', OTP)
      res.cookie('email', req.body.email)
      const info = await transporter.sendMail({
        from: "janakkhokhar28@gmail.com", // sender address
        to: CheckEmailData.email, // list of receivers
        subject: "OTP ✔", // Subject line
        html: `<b>OTP ${OTP}</b>`, // html body
      });
      console.log("Message Sent");
      return res.redirect("/admin/otppage");
    } else {
      console.log("Email not Found");
      return res.redirect("back");
    }
  } catch (error) {
    console.log("something worng" + error);
    return res.redirect("back");
  }
};


module.exports.verifyotp = async (req, res) => {

  if (req.body.otp == req.cookies.otp) {
    return res.render('forgotpass/newpassword');
  }
  else {
    console.log("Otp Not Match");
    return res.redirect('back');
  }

}


module.exports.changepassword = async function (req, res) {
  try {
    if (req.body.npass == req.body.cpass) {
      let data = await adminpanel.findOne({ email: req.cookies.email });
      if (data) {
        let reset = await adminpanel.findByIdAndUpdate(data.id, { password: req.body.npass });
        if (reset) {
          res.clearCookie('otp');
          res.clearCookie('email');
          return res.redirect('/admin');
        }
        else {
          console.log("Password Not Updated");
          return res.redirect('back');
        }
      }
      else {
        console.log("admin not found");
        return res.redirect('back')
      }
    }
    else {
      console.log("New and Confirm Password Not Match");
      return res.redirect('back');
    }
  }
  catch (err) {
    console.log("something went wrong");
    res.redirect('back');
  }
};


//end




// profile

module.exports.profile = async (req, res) => {
  return res.render('profile');
}

module.exports.Editprofile = async (req, res) => {
  try {
    let oldData = await adminpanel.findById(req.body.oldId);
    if (req.file) {
      if (oldData.AdminImage) {
        let fullPath = path.join(__dirname, ".." + oldData.AdminImage);
        await fs.unlinkSync(fullPath);
      }
      let imagePath = "";
      imagePath = adminpanel.AdminModelPath + "/" + req.file.filename;
      req.body.AdminImage = imagePath;
      res.locals.user.AdminImage = imagePath;
    } else {
      req.body.AdminImage = oldData.AdminImage;
    }

    await adminpanel.findByIdAndUpdate(req.body.oldId, req.body);
    let adminData = await adminpanel.findById(req.body.oldId);
    res.locals.user = adminData;
    return res.redirect("/admin/profile");
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }

}

//end




//multipal Delete

module.exports.DeleteAllRecord = async (req, res) => {
  // console.log(req.body);
  await adminpanel.deleteMany({ '_id': { $in: req.body.deleteAll } });
  return res.redirect('back');
}
// End