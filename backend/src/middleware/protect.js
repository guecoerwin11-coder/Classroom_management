const jwt = require("jsonwebtoken")

const protect = (req, res,next)=> {
    try{

        const authHead = req.headers.authorization;

        if(!auth){
            return res.status(403).json({
                message: 'Invalid token!'
            })
        }

        const veri = authHead.split(' ')[1];
        const decode = jwt.verify(veri, process.env.JWT_SECRET)

        req.user = decode;
        next();
    }catch(err){
        res.status(500).json({message: err.message})
    }
}
module.exports = protect;