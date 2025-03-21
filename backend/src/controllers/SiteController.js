class SiteController {
  index(req, res, next) {
    res.send('index page');
  }
}

module.exports = new SiteController();
