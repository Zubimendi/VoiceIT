// middlewares/admin.js
const isAdmin = (req, res, next) => {
    if (!req.isAdmin) {
      return res.status(403).json({ message: 'Require Admin Role!' });
    }
    next();
  };
  
  module.exports = isAdmin;