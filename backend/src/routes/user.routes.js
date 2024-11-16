import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWTUser from "../middleware/authUser.middleware.js";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateName, 
    addToWishlist, 
    removeFromWishlist, 
    findWishlist 
} from "../controller/user.controller.js";

const router = Router();

router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(loginUser);

//Secured routes
router.route("/logout").post(verifyJWTUser, logoutUser);
router.route("/update-name").post(upload.none(), verifyJWTUser, updateName);
router.route("/wishlist").post( verifyJWTUser, findWishlist);
router.route("/add-to-wishlist").post( verifyJWTUser, addToWishlist);
router.route("/remove-from-wishlist").post( verifyJWTUser, removeFromWishlist);

export default router;