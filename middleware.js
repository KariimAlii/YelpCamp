module.exports.isLoggedIn = (req, res, next) => {
    //console.log("REQ.USER===>", req.user);
    if (!req.isAuthenticated()) {
        // store the url they are requesting!
        //console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!!");
        return res.redirect("/login");
    }
    next();
};

module.exports.checkReturnTo = (req,res,next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo; 
    }
    next();
}
