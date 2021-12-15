import React from "react";
import { removeCartItem } from "../../utils/FirebaseData";
import { useStateValue } from "../../StateProvider";
import placeholder from "../../assets/placeholder.png";

const CartItem = ({ product, index }) => {
    const [{ user, userDetails }, dispatch] = useStateValue();
    const stars = [];
    for (let i = 1; i <= parseInt(product.rating); i++) {
        stars.push(<>&#9733;</>);
    }
    for (let i = 5 - parseInt(product.rating); i > 0; i--) {
        stars.push(<>&#9734;</>);
    }

    const removeFromCart = () => {
        const newCart = [...userDetails.cart];
        newCart.splice(index, 1);

        removeCartItem(newCart, user);
        dispatch({
            type: "REMOVE_FROM_CART",
            cart: newCart,
        });
    };

    return (
        <div className="cartItem">
            <div className="cartItem_left">
                <img src={product.image} alt="" placeholder={placeholder} />
            </div>
            <div className="cartItem_right">
                <div className="cartItem_detailTop">
                    <h2 className="cartItem_title">{product.name}</h2>
                    <strong className="cartItem_price">
                        <sup>₹</sup>
                        {product.price}.00
                    </strong>
                    <p className="cartItem_stars">
                        {stars.map((star) => star)}
                    </p>
                    <p className="cartItem_description">
                        {product.description.length > 300
                            ? `${product.description.substring(0, 300)}...`
                            : product.description}
                    </p>
                </div>
                <div className="cartItem_detailBottom" onClick={removeFromCart}>
                    Remove From Cart
                </div>
            </div>
        </div>
    );
};

export default CartItem;
