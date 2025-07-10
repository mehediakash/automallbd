const uploadProductModel = require("../model/uploadProductModel");

async function searchProducts(req, res) {
    try {
        const { query, category, subCategory, minPrice, maxPrice, sortBy, order, page = 1, limit = 10 } = req.query;

        const filters = {};

        // Add filters based on query parameters
        if (query) {
            filters.title = { $regex: query, $options: "i" }; // Case-insensitive search
        }

        if (category) {
            filters.category = category;
        }

        if (subCategory) {
            filters.subCategory = subCategory;
        }

        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = Number(minPrice); // Greater than or equal to minPrice
            if (maxPrice) filters.price.$lte = Number(maxPrice); // Less than or equal to maxPrice
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Sorting
        const sort = {};
        if (sortBy) {
            sort[sortBy] = order === "desc" ? -1 : 1;
        }

        // Query the database
        const products = await uploadProductModel
            .find(filters)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        // Count total results
        const total = await uploadProductModel.countDocuments(filters);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            limit: Number(limit),
            products,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to search products", error: error.message });
    }
}

module.exports = { searchProducts };
