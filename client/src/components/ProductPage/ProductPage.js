import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSingleProduct } from "../../utils/FirebaseData";
import CurrencyFormat from "react-currency-format";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Loading from "../Loading";
import { useStateValue } from "../../StateProvider";
import { updateCart } from "../../utils/FirebaseData";
import "../ProductPage/ProductPage-styles.css";
import Product from "../Product/Product";
import placeholder from "../../assets/placeholder.png";

const ProductPage = () => {
    const [{ user, userDetails }, dispatch] = useStateValue();
    const navigate = useNavigate();

    const search = useLocation().search;
    const pId = new URLSearchParams(search).get("pId");
    const category = new URLSearchParams(search).get("category");
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stars, setStars] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchProduct = async () => {
            if (pId !== null && category !== null) {
                const returnedproducts = await getSingleProduct(pId, category);
                setProduct(returnedproducts["singleProduct"]);
                setProducts(returnedproducts["allProducts"]);
                const tempStars = [];
                for (let i = 1; i <= parseInt(product?.rating); i++) {
                    tempStars.push(<>&#9733;</>);
                }
                for (let i = 5 - parseInt(product?.rating); i > 0; i--) {
                    tempStars.push(<>&#9734;</>);
                }
                setStars(tempStars);
                setLoading(false);
            } else {
                setProduct(null);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [pId, category]);

    const addToCartAction = () => {
        if (user === null) {
            navigate("/login");
        } else if (userDetails?.cart.length === 10) {
            alert("Cannot add more than 10 items in cart.");
        } else {
            try {
                updateCart(userDetails?.cart, product, user);
                dispatch({
                    type: "ADD_TO_CART",
                    product: product,
                });
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="productPage">
                {product === null && loading === false ? (
                    <div className="productPage_noProduct">
                        Product not found.
                    </div>
                ) : loading ? (
                    <div className="home_loading">
                        <Loading />
                    </div>
                ) : (
                    <div className="productPage_allProducts">
                        <div className="productPage_contents">
                            <div className="productPage_left">
                                <img
                                    src={product?.image}
                                    alt=""
                                    placeholder={placeholder}
                                />
                            </div>
                            <div className="productPage_right">
                                <div className="productPage_top">
                                    <h1 className="productPage_title">
                                        {product?.name}
                                    </h1>
                                    <h2 className="productPage_price">
                                        <CurrencyFormat
                                            renderText={(value) => value}
                                            decimalScale={2}
                                            value={product?.price}
                                            displayType={"text"}
                                            thousandSeparator={true}
                                            prefix={"₹"}
                                        />
                                        /-
                                    </h2>
                                    <p className="productPage_stars">
                                        {stars?.map((star) => star)}
                                    </p>
                                    <div className="productPage_description">
                                        <h3>Product Description:</h3>
                                        <p>"{product.description}"</p>
                                    </div>
                                </div>
                                <div className="productPage_bottom">
                                    <p
                                        className="productPage_addToCart"
                                        onClick={addToCartAction}
                                    >
                                        Add to Cart
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="productsPage_similarProducts">
                            <h2>Similar Products</h2>
                            <div className="productPage_similarList">
                                {products.map((oneProduct) => (
                                    <Product
                                        product={oneProduct}
                                        category={category}
                                        id={oneProduct.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ProductPage;
