export const checkAuth = (req, res, next) => {
    if(req.session.user)
        return next();

    res.status(401).send('Unauthenticated user');
}