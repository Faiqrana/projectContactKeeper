const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const config = require("config");

const router = express.Router();

const User = require("../models/User");

const { check, validationResult } = require("express-validator");

//@route POST api/user
//@desc register user
//@access public
router.post(
  "/",
  [
    check("name", "Please Add Name")
      .not()
      .isEmpty(),
    check("email", "Please Add Email").isEmail(),
    check("password", "Plase Add Password of Lenghth 6").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ msg: "user already exits" });
      }

      user = new User({
        name,
        email,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: { id: user.id }
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server not found");
    }
  }
);
module.exports = router;
