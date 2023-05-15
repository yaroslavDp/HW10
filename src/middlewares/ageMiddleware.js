export const ageValid = (req, res, next) => {

    if(!req.body.age || req.body.age < 0) {
        req.body.age = 1;
    }
    next()
}