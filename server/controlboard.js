const Note = require("./Db_models/Notes");
//Import our notes module for NoteSchema MongoDB
const mongoose = require("mongoose");




//FUCNTIONS FOR OUR CONTROLBOARD>  CALLED BY ROUTER.JS
/**
 * GET /
 * Homepage 
*/
exports.frontpage = async (req, res) => {
  res.render('index');
}

/**
 * GET /
 * Dashboard
 */
exports.dashboard = async (req, res) => {

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    // Mongoose "^7.0.0 Update
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      }
      ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(); 

    const count = await Note.count();

    res.render('overview', {
      userName: req.user.firstName,
      notes,
      current: page,
      pages: Math.ceil(count / perPage)
    });
 
  } catch (error) {
    console.log("THERES AN ERROR: " + error);
  }
};

/**
 * GET /
 * View Specific Note
 */
exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();

    res.render("viewnote", {
      noteID: req.params.id,
      note,
    });

};

/**
 * PUT /
 * Update Specific Note
 */
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * DELETE /
 * Delete Note
 */
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Add Notes
 */
exports.dashboardAddNote = async (req, res) => {
  res.render("addnote");
};

/**
 * POST /
 * Add Notes
 */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Search
 */
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("searchnote", {
      searchResults: "",
    });
  } catch (error) {}
};

/**
 * POST /
 * Search For Notes
 */
exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("searchnote", {
      searchResults
    });
  } catch (error) {
    console.log(error);
  }
};
