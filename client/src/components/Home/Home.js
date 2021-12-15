import React, { useState, useEffect } from "react";
import Product from "../Product/Product";
import { getProducts } from "../../utils/FirebaseData";
import "../Home/Home-styles.css";
import Navbar from "../Navbar/Navbar";
import HeroImage from "../HeroImage/HeroImage";
import Loading from "../Loading";

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState({});

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            try {
                for (let i = 0; i < categories.length; i++) {
                    const currentProduct = await getProducts(categories[i].key);
                    setProducts((p) => {
                        return {
                            ...p,
                            [`${categories[i].key}`]: currentProduct,
                        };
                    });
                }
            } catch (err) {
                console.log(err.message);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [categories]);

    useEffect(() => {
        const performFetch = async () => {
            setLoading(true);
            try {
                setCategories(await getProducts("categories"));
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };

        performFetch();
    }, []);

    return (
        <>
            <Navbar />
            <HeroImage />
            <div className="home">
                <div className="home_contents">
                    {!loading ? (
                        categories.map((category) => (
                            <div
                                className="home_categoryProduct"
                                id={`${category.key}`}
                            >
                                <p>{category?.value}</p>
                                <div className="home_category">
                                    {products[`${category.key}`]?.map(
                                        (product) => (
                                            <Product
                                                product={product}
                                                category={category.key}
                                                key={product?.id}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <Loading />
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
