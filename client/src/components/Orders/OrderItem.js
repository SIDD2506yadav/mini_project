import placeholder from "../../assets/placeholder.png";

const OrderItem = ({ product }) => {
    return (
        <div className="orderItem">
            <div className="cartItem_left">
                <img src={product.image} alt="" placeholder={placeholder} />
            </div>
            <div className="cartItem_right">
                <div className="cartItem_detailTop">
                    <h2 className="orderItem_title">{product.name}</h2>
                    <strong className="orderItem_price">
                        <sup>₹</sup>
                        {product.price}.00
                    </strong>
                    <p className="orderItem_description">
                        {/* {product.description.length > 300
                            ? `${product.description.substring(0, 300)}...`
                            : product.description} */}
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
