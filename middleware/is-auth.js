module.exports = (req, res, next) => {
    if(!req.session.isAuthenticate) {
        return res.status(401).redirect('/login');
    }
    next();
}