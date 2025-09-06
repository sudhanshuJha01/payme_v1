import jwt from "jsonwebtoken";
import dotev from 'dotenv'

dotev.config({
    path:'./.env'
})

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

export const userAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ msg: "Authentication failed: No token provided." });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, accessTokenSecret);
        req.userId = decoded._id;
        next();
    } catch (err) {
        console.error("Error in token verification:", err.name, err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, msg: "Authentication failed: Token has expired." });
        }
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, msg: "Authentication failed: Invalid token." });
        }
        return res.status(500).json({ success: false, msg: "Internal server error." });
    }
};