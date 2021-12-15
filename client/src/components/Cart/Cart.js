import { useEffect, useState } from "react";
import { useStateValue } from "../../StateProvider";
import { useNavigate } from "react-router-dom";
import axios from "../../Axios";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "react-currency-format";
import "../Cart/Cart-styles.css";
import Navbar from "../Navbar/Navbar";
import CartItem from "./CartItem";
import { removeCartItem, updateOrders } from "../../utils/FirebaseData";

const Cart = () => {
    const [{ user, userDetails }, dispatch] = useStateValue();
    const [currentUser, setCurrentUser] = useState(null);
    const [total, setTotal] = useState(0);

    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState(true);

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            setCurrentUser(userDetails);
            let total1 = 0;
            await userDetails?.cart?.map((item) => {
                total1 += parseInt(item.price.replace(/,/g, ""));
            });
            setTotal(total1);
        };
        fetchUserDetails();
    }, [dispatch, user, userDetails?.cart, userDetails]);

    useEffect(() => {
        const getClientSecret = async () => {
            if (total > 0) {
                try {
                    const response = await axios({
                        method: "post",
                        url: `/payments/create?total=${total * 100}`,
                    });

                    setClientSecret(response.data.clientSecret);
                } catch (error) {
                    console.log(error.message);
                }
            }
        };

        getClientSecret();
    }, [total]);

    const handleSubmit = () => {
        if (total > 0 && !processing) {
            setProcessing(true);
            setError(null);
            stripe
                .confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    },
                })
                .then((result) => {
                    const paymentIntent = result.paymentIntent;
                    const paymentId = paymentIntent.id;
                    const currentDate = new Date();
                    const dateStamp = Date.now();
                    const orderDetail = {
                        [`${dateStamp}`]: {
                            order: userDetails.cart,
                            created: currentDate.toString(),
                            amount: total,
                            orderId: paymentId,
                        },
                    };
                    updateOrders(orderDetail, user);
                    dispatch({
                        type: "ADD_TO_ORDERS",
                        order: orderDetail[`${dateStamp}`],
                    });
                    const orderList = userDetails.cart.reduce((total, item) => {
                        return total + item.name + ", ";
                    }, "");
                    axios({
                        method: "post",
                        url: `/sendmail?email=${currentUser.email}&orderId=${paymentId}&orderItem=${orderList}`,
                    }).then((res) => console.log(res));
                    removeCartItem([], user);
                    dispatch({
                        type: "EMPTY_CART",
                    });
                    setError(null);
                    setProcessing(false);
                    navigate("/orders");
                })
                .catch((error) => {
                    setError(error.message);
                    setProcessing(false);
                });
        }
    };

    const handleChange = () => {};

    return (
        <>
            <Navbar />
            <div className="cart">
                {currentUser === null ? (
                    <div className="cart_noUser">
                        <h2>
                            Please sign in to your account to see your cart
                            items.
                        </h2>
                    </div>
                ) : (
                    <div className="cart_contents">
                        <span className="cart_userName">
                            Hello, <strong>{currentUser?.name}</strong>.
                        </span>
                        <div className="cart_addressSpan">
                            <strong>Deliever to:</strong>
                            <span className="cart_address">
                                <small>{currentUser?.address1},</small>
                                <small>{currentUser?.address2},</small>
                                <small>{currentUser?.address3}.</small>
                            </span>
                        </div>
                        <div className="cart_goToCheckout">
                            <h2 className="cart_subtotal">
                                Your subtoal
                                {`(${currentUser?.cart?.length} items)`}:{" "}
                                <strong>
                                    <CurrencyFormat
                                        renderText={(value) => value}
                                        decimalScale={2}
                                        value={total}
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"₹"}
                                    />
                                </strong>
                            </h2>
                            <div className="cart_paymentCard">
                                <form className="cart_paymentForm">
                                    <CardElement
                                        className="cardElement"
                                        onChange={(e) => handleChange(e)}
                                    />
                                </form>
                            </div>
                            <span
                                className={`cart_proceedCheckout ${
                                    total === 0 ? "cart_disableButton" : ""
                                }`}
                                onClick={handleSubmit}
                            >
                                {processing
                                    ? "Processing..."
                                    : "Proceed To Checkout"}
                            </span>
                            {error ? (
                                <p className="cart_paymentError">
                                    Error: {error}
                                </p>
                            ) : (
                                ""
                            )}
                        </div>
                        <p>Your cart have {currentUser?.cart?.length} item.</p>
                        <div className="cart_items">
                            {currentUser?.cart.map((cartItem, index) => (
                                <CartItem
                                    product={cartItem}
                                    index={index}
                                    id={Math.random() * 1000}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
