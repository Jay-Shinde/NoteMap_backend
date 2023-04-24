const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
JWT_secKey = "jayeshissavingthisasa@#$!#@$$%@#$secretkey";
//JWT_secKey = process.env.JWT_secKey;
const fetchuser = require('../middleware/fetchuser');

//------route 1-------create user using : post  "/api/auth/createuser"   no login required-----------------//

router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("name", "Enter name of atleast 5 characters").isLength({ min: 3 }),
    body("password", "Enter a password of atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    //res.send(req.body);

    //following code is for validation

    //if there are errors then this code returns error msg with a bad request
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({success, errors: errors.array() });

    //code for checking unique email id using async method and if not unique then send msg
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "sorry , user  with this email already exists" });
      }

      //following code used for
      //both sending  req body as response
      //and saving in mongo db
      //while no error encountered
      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
      });
      const data = {
        userID: user.id,
      };
      var authtoken = jwt.sign(data, JWT_secKey);
      //console.log(authtoken);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured !");
    }

    //above code can be used by using async await function

    //we were using this code as promise without using async...
    //also following code will generate same msg "Unique email" for every error which is not right anyway

    // .then(user => {res.json(user)})
    // .catch(err =>{
    //     console.log(err);
    //     res.json({
    //         msg:"Enter Unique email address",
    //         error:err.message
    //     })
    // })

    // same code without validation for saving the data in db

    // res.send(req.body);
    // const user = User(req.body);
    // user.save();
  }
);

//-----route 2------authenticate a user using : post  "/api/auth/login"   no login required-------------------//

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can not be blank !").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({success, error: "Enter valid credentials !" });
      }

      const passcompre = await bcrypt.compare(password, user.password);
      if (!passcompre) {
        return res.status(400).json({success, error: "Enter valid credentials !" });
      }

      const data = {
        userID: user.id,
      };
      var authtoken = jwt.sign(data, JWT_secKey);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({success, error: "Internal server error !" });
    }
  }
);

//-----route 3-------get logged in user details using: Post "/api/auth/getuser"--login required------------//

router.post(
  "/getuser",
  fetchuser,
  async (req, res) => {

    try {
      const user = await User.findById(req.user).select("-password");
      res.send(user);

    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error !");
    }
  }
);

module.exports = router;
