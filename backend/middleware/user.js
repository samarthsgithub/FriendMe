const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yoursecretkey';

function userMiddleware(req,res,next){
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return res.status(401).json({message:"Authorization token required"});
    }
    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:'Auth token requierd'});
    }
    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        console.error(error);
        return res.status(401).json({message:"Invalid or expired toekn"});
    }
}



// Middleware to redirect if already authenticated;
function redirectIfAuthenticated(req,res,next){
    const authHeader = req.headers['authorization'];
    if(!authHeader){
        return next();
    }  
    const token = authHeader.split(' ')[1];
    if(!token){
        return next();
    }                           
    try{
        jwt.verify(token,JWT_SECRET);
        return res.status(403).json({message:"Already logged in. Cannot access signin signup"})
    }catch(err){       
        return next();
    }
};
module.exports = {userMiddleware,
    redirectIfAuthenticated
};