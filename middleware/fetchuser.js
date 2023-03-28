var jwt = require("jsonwebtoken");
const JWT_secKey = "jayeshissavingthisasa@#$!#@$$%@#$secretkey";
//const JWT_secKey = process.env.JWT_secKey;
const fetchuser = (req, res, next)=>{
    //get the user from the jwt token and add id to reqest obj
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"access denied, please authenticate using valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_secKey);
        req.user = data.userID;
        
        next()
        
    } catch (error) {
        res.status(401).send({error:"access denied, please authenticate using valid token"});
    }
    
}


module.exports = fetchuser;