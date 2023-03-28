const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//------route 1-------get all the notes from the user using : get  "/api/auth/fetchmotes" login required-----------------//

router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user });
    res.send(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error !");
  }
});

//------route 2-------add notes from the user using : get  "/api/notes/addnote" login required-----------------//

router.post(
  "/addnote",
  [
    body("title", "Enter atleast 3 characters").isLength({ min: 3 }),
    body("description", "Enter atleast 5 characters").isLength({ min: 5 }),
  ],
  fetchuser,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const { title, description, tag } = req.body;
      const note = new Notes({ user: req.user, title, description, tag });
      const savednote = await note.save();
      res.json(savednote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("some error occured !");
    }
  }
);

//------route 3-------update the notes using : Put "/api/auth/updatenote" login required-----------------//

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    var note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("not found");
    }
    if (note.user.toString() !== req.user) {
      return res.status(401).send("Not Allowed !");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error !");
  }
});

//------route 4-------delete the notes using : delete "/api/auth/deletenote" login required-----------------//

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    var note = await Notes.findById(req.params.id);
    if (!note) { 
      return res.status(404).send("not found");
    } 
    if (note.user.toString() !== req.user) {
      return res.status(401).send("Not Allowed !");
    }

    // note = await Notes.findByIdAndUpdate(
    //   req.params.id,
    //   { $set: newNote },
    //   { new: true }
    // );
    // res.json(note);

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({note:note, status:"deleted successfuly"})
   

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error !");
  }
});

module.exports = router;
