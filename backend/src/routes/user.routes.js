import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWTUser from "../middleware/authUser.middleware.js";
import {
    //Login-register
    registerUser,
    loginUser,
    logoutUser,

    //Update details
    updateName,
    updateEmail,
    updatePassword,
    updateProfilepicture,
    updateAddress,

    //Wishlist
    addToWishlist,
    removeFromWishlist,
    findWishlist,

    //Cart
    addToCart,
    removeFromCart,
    findCart,

    //Purchase
    orderConfirmation,
    confirmOrder,

    //Orders
    fetchOrders,
    orderDetails,
    changeDeliveryStatus,
    addReview,
    updateReview,

    //Seller details
    fetchSeller,
    fetchSellerProducts,
    fetchSellerReviews,
} from "../controller/user.controller.js";

const router = Router();

//Login-register
router.route("/register").post(upload.none(), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWTUser, logoutUser);

//Update details
router.route("/update-name").post(verifyJWTUser, updateName);
router.route("/update-email").post(verifyJWTUser, updateEmail);
router.route("/update-password").post(verifyJWTUser, updatePassword);
router.route("/update-profilepicture").post(verifyJWTUser, upload.single("newProfilepicture"), updateProfilepicture);
router.route("/update-address").post(verifyJWTUser, updateAddress);

//Wishlist
router.route("/add-to-wishlist").post(verifyJWTUser, addToWishlist);
router.route("/remove-from-wishlist").post(verifyJWTUser, removeFromWishlist);
router.route("/wishlist").post(verifyJWTUser, findWishlist);

//Cart
router.route("/add-to-cart").post(verifyJWTUser, addToCart);
router.route("/remove-from-cart").post(verifyJWTUser, removeFromCart);
router.route("/cart").post(verifyJWTUser, findCart);

//Purchase
router.route("/order-confirmation").post(verifyJWTUser, orderConfirmation);
router.route("/confirm-order").post(confirmOrder);

//Orders
router.route("/fetch-orders").post(verifyJWTUser, fetchOrders);
router.route("/order-details").post(verifyJWTUser, orderDetails);
router.route("/change-delivery-status").post(verifyJWTUser, changeDeliveryStatus);
router.route("/add-review").post(verifyJWTUser, upload.array('images', 5), addReview);
router.route("/update-review").post(verifyJWTUser, upload.array('images', 5), updateReview);

//Seller details
router.route("/fetch-seller").post(fetchSeller);
router.route("/fetch-seller-products").post(fetchSellerProducts);
router.route("/fetch-seller-reviews").post(fetchSellerReviews);

export default router;