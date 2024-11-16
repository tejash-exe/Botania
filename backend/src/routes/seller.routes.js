import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWTSeller from "../middleware/authSeller.middleware.js";
import { 
    registerSeller, 
    loginSeller, 
    logoutSeller, 
    addProducts, 
    updateProduct 
} from "../controller/seller.controller.js";

const router = Router();

router.route("/register").post(registerSeller);
router.route("/login").post(upload.none(), loginSeller);

//Secured routes
router.route("/logout").post(verifyJWTSeller, logoutSeller);
router.route("/add-products").post(verifyJWTSeller, upload.single("coverImage"),addProducts);
router.route("/update-product").post(verifyJWTSeller, upload.none(), updateProduct);

export default router;