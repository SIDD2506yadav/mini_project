import { useEffect, useState } from "react";
import { useStateValue } from "../../StateProvider";
import OrderItem from "./OrderItem";
import CurrencyFormat from "react-currency-format";
import "../Orders/Orders-styles.css";
import Navbar from "../Navbar/Navbar";

const Orders = () => {
    const [{ user, userDetails, orders }] = useStateValue();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setCurrentUser(userDetails);
        };
        fetchUserDetails();
    }, [user, userDetails?.cart, userDetails]);

    return (
        <>
            <Navbar />
            <div className="orders">
                {currentUser === null ? (
                    <div className="orders_noUser">
                        <h2>
                            Please sign in to your account to see your orders.
                        </h2>
                    </div>
                ) : (
                    <div className="orders_content">
                        <h1>Orders</h1>
                        <div className="orders_list">
                            {orders.length === 0 ? (
                                <p className="orders_noOrders">
                                    No orders yet.
                                </p>
                            ) : (
                                ""
                            )}
                            {orders.map((singleOrder) => (
                                <div className="order_single">
                                    <div className="order_details">
                                        <span className="orders_date">
                                            Ordered on:{" "}
                                            <p>{singleOrder?.created}</p>
                                        </span>
                                        <span className="orders_id">
                                            Order Id:{" "}
                                            <p>{singleOrder?.orderId}</p>
                                        </span>
                                        <span className="order_amount">
                                            Order Total:
                                            <p>
                                                <CurrencyFormat
                                                    className="order_price"
                                                    renderText={(value) =>
                                                        value
                                                    }
                                                    decimalScale={2}
                                                    value={singleOrder?.amount}
                                                    displayType={"text"}
                                                    thousandSeparator={true}
                                                    prefix={"₹"}
                                                />
                                            </p>
                                        </span>
                                    </div>
                                    <div className="orders_orderItems">
                                        {singleOrder?.order?.map(
                                            (orderItem) => (
                                                <OrderItem
                                                    product={orderItem}
                                                    id={orderItem.id}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Orders;
