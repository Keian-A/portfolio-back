module.exports = (req, res, next) => {
    console.log(`HIT ${req.method} ROUTE`);
    next();
}