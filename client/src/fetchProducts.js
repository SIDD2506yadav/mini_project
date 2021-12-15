import axios from "axios";

export const getProducts = async (category) => {
    const data = await axios.get(
        `https://fakestoreapi.com/products/category/${category}`
    );

    const products = await data.data;
    return products;
};

// https://fakestoreapi.com/products/category/men's%20clothing
