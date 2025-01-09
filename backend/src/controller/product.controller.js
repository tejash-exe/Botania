import Product from "../models/Product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const findProducts = async (req, res) => {
    try {
        const search = req.params?.search;
        const searchBy = req.body.searchBy;
        const minPrice = Number.parseInt(req.body.minPrice) || 0;
        const maxPrice = Number.parseInt(req.body.maxPrice) || 5000;

        let query = {
            $or: [
                { name: { $regex: search.trim(), $options: 'i' } },
                { description: { $regex: search.trim(), $options: 'i' } },
            ],
        };

        let sortOptions = { createdAt: -1 };

        if (search === "false" || search === ":search" || search?.trim() === "") {
            query = {};
        };

        if (!searchBy) throw new Error("Searchby is missing!");

        if (searchBy == 'Recently added') {
            sortOptions = { createdAt: -1 };
        }
        else if (searchBy == 'Price: High to low') {
            sortOptions = { price: -1, createdAt: -1 };
        }
        else if (searchBy == 'Price: Low to high') {
            sortOptions = { price: 1, createdAt: -1 };
        }
        else if (searchBy == 'Avg. customer reviews') {
            sortOptions = { 'soldBy.averageRating': -1, createdAt: -1 };
        };

        const products = await Product.aggregate([
            {
                $match: {
                    ...query,
                    availability: true,
                    price: { $gte: minPrice || 0, $lte: maxPrice || 5000 },
                },
            },
            {
                $lookup: {
                    from: 'sellers', 
                    localField: 'soldBy', 
                    foreignField: '_id', 
                    as: 'soldBy',
                },
            },
            {
                $unwind: {
                    path: '$soldBy',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    // availability: 1,
                    price: 1,
                    // coverImage: 1,
                    images: 1,
                    // createdAt: 1,
                    // updatedAt: 1,
                    'soldBy.averageRating': 1, // Include specific fields from soldBy
                    // 'soldBy.email': 1, // Include email if applicable
                    // 'soldBy.phone': 1, // Example of another field
                },
            },
            {
                $sort: sortOptions,
            },
        ]);
        if(!products) throw new Error("Cannot find products related to keyword!");
        console.log(products);

        res.json(new ApiResponse(200, "Product fetched successfully!", products));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

const productDetails = async (req, res) => {
    try {
        const productid = req.params?.productid;
        if (!productid) throw new Error("Product id not found!");

        const product = await Product.findById(productid.trim()).populate({
            path: 'soldBy',
            select: 'name address brandName profilePicture averageRating',
        }).lean();
        if(!product) throw new Error("Product does not exists!");

        res.json(new ApiResponse(200, "Product found succesfully!", product));
    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    };
};

export { findProducts, productDetails };