import { Router } from "express"
import { findProducts, productDetails } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.route('/:search').post(upload.none(), findProducts);
router.route('/getproduct/:productid').post(upload.none(), productDetails );


export default router;