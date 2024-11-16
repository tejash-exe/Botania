import Product from "../models/Product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const findProducts = async (req, res) => {
    try {
        const search = req.params?.search;
        const searchBy = req.body.searchBy;

        let query = {
            $or: [
                {name: { $regex: search.trim(), $options: 'i'}},
                {description: { $regex: search.trim(), $options: 'i'}}
            ]
        };
        
        let sortOptions = { updatedAt: -1 };

        if (search === "false" || search === ":search" || search?.trim() === "") {
            query = {};
        }

        if (!searchBy) throw new Error("Searchby is missing!");

        if (searchBy == 'Recently added') {
            sortOptions = { updatedAt: -1 };
        }
        else if (searchBy == 'Price: High to low') {
            sortOptions = { price: -1 , updatedAt: -1 };
        }
        else if (searchBy == 'Price: Low to high') {
            sortOptions = { price: 1 , updatedAt: -1 };
        }
        else if (searchBy == 'Most ordered') {
            sortOptions = { quantity: -1 , updatedAt: -1 };
        }
        else if (searchBy == 'Avg. customer reviews') {
            sortOptions = { averageRating: -1 , updatedAt: -1 };
        }

        // const products = await Product.find(query).sort(sortOptions)
        const products = await Product.aggregate([
            {
                $match: query,
            },
            {
                $sort: sortOptions,
            },
            {
                $lookup: {
                    from: 'productreviews',
                    as: 'reviews',
                    localField: '_id',
                    foreignField: 'product'
                }
            },
            {
                $addFields: {
                    reviews: { $size: "$reviews" }
                }
            }
        ])
        .catch(error => { throw new Error("Cannot find products related to keyword!") });
        
        return res.json(new ApiResponse(200, "Product fetched successfully!", products));


    } catch (error) {
        res.json(new ApiResponse(400, error.message));
    }
};

const productDetails = async (req, res) => {
    try {
        const productid = req.params?.productid;
        if(!productid) throw new Error("Product id not found!");

        const product = await Product.findById(productid.trim())
        .catch(error => { throw new Error("Invalid ID!")});

        res.json(new ApiResponse(200,"Product found succesfully!", product))
    } catch (error) {
        res.json(new ApiResponse(400, "Cannot fetch product!" , {error}))
    }
}

export { findProducts, productDetails };