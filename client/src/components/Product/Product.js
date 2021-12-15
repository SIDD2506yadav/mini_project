import { Link, useNavigate } from "react-router-dom";
import "../Product/Product-styles.css";
import { useStateValue } from "../../StateProvider";
import { updateCart } from "../../utils/FirebaseData";
import placeholder from "../../assets/placeholder.png";

const Product = ({ product, category }) => {
    const [{ user, userDetails }, dispatch] = useStateValue();
    const navigate = useNavigate();

    const stars = [];
    for (let i = 1; i <= parseInt(product.rating); i++) {
        stars.push(<>&#9733;</>);
    }
    for (let i = 5 - parseInt(product.rating); i > 0; i--) {
        stars.push(<>&#9734;</>);
    }

    const addToCart = () => {
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
        <div className="product">
            <div className="product_contents">
                <div className="product_image">
                    <img src={product.image} alt="" placeholder={placeholder} />
                </div>
                <div className="product_details">
                    <Link
                        to={`/productPage?pId=${product?.id}&category=${category}`}
                        className="product_linkTag"
                    >
                        <strong className="product_title">
                            {product.name}
                        </strong>
                    </Link>
                    <h5 className="product_price">
                        <sup>₹</sup>
                        {product.price}.00/- Only
                    </h5>
                    <p className="product_rating">
                        {stars.map((star) => star)}
                    </p>
                    <div onClick={addToCart} className="product_addToCart">
                        Add To Cart
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
