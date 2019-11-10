const express = require("express");

const router = express.Router();
const User = require("../models/User");
const Contact = require("../models/Contacts");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

//@route GET api/contacts
//@desc  get all user's contacts
//@access public
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ msg: "Server Not Found" });
  }
});

//@route POST api/contacts
//@desc  Add new Contact
//@access private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is Required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.log(err.message);
      return res.send(500).json({ msg: "Server Not Found" });
    }
  }
);

//@route PUT api/contacts:id
//@desc  update user's contacts
//@access private
router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // Build contact object
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    // Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.error(er.message);
    res.status(500).send("Server Error");
  }
});

//@route DELETE api/contacts:id
//@desc  delete user's contacts
//@access private
router.delete("/:id", (req, res, next) => {
  Contact.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Deleted!" });
    })
    .catch(error => {
      res.status(400).json({ error: error });
    });
});

module.exports = router;
