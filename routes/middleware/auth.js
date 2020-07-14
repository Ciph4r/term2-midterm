const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
        return res.render('error' , {errors: 'YOU NEED TO BE LOGGED IN TO VIEW THIS PAGE'})
    }
  };

  module.exports = auth
