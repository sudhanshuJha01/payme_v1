import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
dotenv.config({
    path:"./.env"
})

const jwt_secret=process.env.JWT_SECRET

export const userAuthMiddleware =async (req, res, next) => {
    try
    {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            msg: "Authorization header is missing or incorrect!",
        });
    }

    const token = authHeader.replace("Bearer ","");

        const decoded = jwt.verify(token, jwt_secret);
        req.userId = decoded.userId;
        next();

}catch(err){
    console.error("Error in the header verification:", err);
    return res.status(501).json({
        success:false,
        msg: "server side token error",
    });
}
};
