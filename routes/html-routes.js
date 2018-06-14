// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads view.html
  app.get("/", function(req, res) {
    res.render(path.join(__dirname, "../views/blog.ejs"));
  });

  // cms route loads cms.html
  app.get("/cms", function(req, res) {
    res.render(path.join(__dirname, "../views/cms"));
  });

    // cms route loads cms.html
    app.get("/cms2", function(req, res) {
      res.render(path.join(__dirname, "../views/cms2"));
    });

  // blog route loads blog.html
  app.get("/blog", function(req, res) {
    res.render(path.join(__dirname, "../views/blog"));
  });

  // authors route loads author-manager.html
  app.get("/authors", function(req, res) {
    res.render(path.join(__dirname, "../views/author-manager"));
  });

};
