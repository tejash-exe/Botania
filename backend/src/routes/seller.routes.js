import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import verifyJWTSeller from "../middleware/authSeller.middleware.js";
import {
    //Login-register
    registerSeller,
    loginSeller,
    logoutSeller,

    //Update details
    updateBrandname,
    updateName,
    updateEmail,
    updatePassword,
    updateProfilepicture,
    updateAddress,

    //Fetch details
    fetchProfile,
    fetchAddress,

    //Link to razorpay
    fetchRazorpay,
    createLinkedAccount,
    createStakeholder,
    requestRouteConfig,
    updateRouteConfig,
    refreshRouteConfig,
    deleteLinkedAccount,

    //Account activation
    requestAccountActivation,

    //Products
    fetchProducts,
    addProduct,
    fetchProductdetails,
    fetchProducttoUpdate,
    setAvailabilityFalse,
    updateProduct,

    //Orders
    fetchOrders,
    orderDetails,
    changeDeliveryStatus,

    //Reviews
    fetchReviews,
} from "../controller/seller.controller.js";

const router = Router();

//Login-register
router.route("/register").post(registerSeller);
router.route("/login").post(upload.none(), loginSeller);
router.route("/logout").post(verifyJWTSeller, logoutSeller);

//Update details
router.route("/update-brandname").post(verifyJWTSeller, updateBrandname);
router.route("/update-name").post(verifyJWTSeller, updateName);
router.route("/update-email").post(verifyJWTSeller, updateEmail);
router.route("/update-password").post(verifyJWTSeller, updatePassword);
router.route("/update-profilepicture").post(verifyJWTSeller, upload.single("newProfilepicture"), updateProfilepicture);
router.route("/change-address").post(verifyJWTSeller, updateAddress);

//Fetch details
router.route("/fetch-profile").post(verifyJWTSeller, fetchProfile);
router.route("/fetch-address").post(verifyJWTSeller, fetchAddress);

//Link to razorpay
router.route("/fetch-razorpay").post(verifyJWTSeller, fetchRazorpay);
router.route("/create-linked-account").post(verifyJWTSeller, createLinkedAccount);
router.route("/create-stakeholder").post(verifyJWTSeller, createStakeholder);
router.route("/request-route-config").post(verifyJWTSeller, requestRouteConfig);
router.route("/update-route-config").post(verifyJWTSeller, updateRouteConfig);
router.route("/refresh-route-config").post(verifyJWTSeller, refreshRouteConfig);
router.route("/delete-linked-account").post(verifyJWTSeller, deleteLinkedAccount);

//Account activation
router.route("/request-account-activation").post(verifyJWTSeller, requestAccountActivation);

//Products
router.route("/fetch-products").post(verifyJWTSeller, fetchProducts);
router.route("/add-product").post(verifyJWTSeller, upload.array('images', 6), addProduct);
router.route("/fetch-productdetails/:productId").post(verifyJWTSeller, fetchProductdetails);
router.route("/fetch-product-to-update/:productId").post(verifyJWTSeller, fetchProducttoUpdate);
router.route("/set-availability-false").post(verifyJWTSeller, setAvailabilityFalse);
router.route("/update-product").post(verifyJWTSeller, upload.array('images', 6), updateProduct);

//Orders
router.route("/fetch-orders").post(verifyJWTSeller, fetchOrders);
router.route("/order-details").post(verifyJWTSeller, orderDetails);
router.route("/change-delivery-status").post(verifyJWTSeller, changeDeliveryStatus);

//Reviews
router.route("/fetch-reviews").post(verifyJWTSeller, fetchReviews);

export default router;