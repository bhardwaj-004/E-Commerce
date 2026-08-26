const jwt = require("jsonwebtoken");
const authmiddleware = (req,res,next) => {
    const authheader = req.headers.authorization;
    if(!authheader){
        return res.status(401).json({
            message: "Token required"
        });
    }
    const token = authheader.split(" ")[1];
    try{
        const decoded = jwt.verify(token,"mysecretkey")
        req.user = decoded;
        next();
    }catch{
        return res.status(401).json({
            message:"Invalid token"
        });
    }
};
module.exports = authmiddleware;