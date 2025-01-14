import jwt from "jsonwebtoken";
import { jwt_secret } from "../Routes/userRouter.js";

export const userAuthMiddleware = (req, res, next) => {
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
    return res.status(401).json({
        msg: "Token is not valid!",
    });
}
};
