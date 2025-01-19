exports.get404 = (req, res, next) => {
    res.status(404).render('notFound.ejs', {
        path: '/notFound',
        pageTitle: 'Not Found',
        isAuthenticated: req.session.isAuthenticate,
    });
};

exports.get500 = (req, res, next) => {
    res.status(500).render('500.ejs', {
        path: '/serverError',
        pageTitle: 'Server Error',
        isAuthenticated: req.session.isAuthenticate,
    });
};