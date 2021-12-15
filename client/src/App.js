import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Firebase";
import { useStateValue } from "./StateProvider";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import Cart from "./components/Cart/Cart";
import { doc, getDoc } from "firebase/firestore";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { db } from "./Firebase";
import Orders from "./components/Orders/Orders";
import ProductPage from "./components/ProductPage/ProductPage";

const promise = loadStripe(
    "pk_test_51JWFNJSCJtrsbBWevOyWIV1e7aWhV0GMEQQ7yduSzSe3QEKWdmVs1Br0UFfeOfrNw2JgxaMpo5xTuWwcH3ZFpFEt00mhtLbmNf"
);

const App = () => {
    const [, dispatch] = useStateValue();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const retrieveDetail = async () => {
            onAuthStateChanged(auth, async (user) => {
                setLoading(true);
                if (user) {
                    const uid = user.uid;
                    const docRef = doc(db, "users", uid);
                    var userData = {};
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        userData = docSnap.data();
                    } else {
                        userData = {};
                    }
                    var orders = [];
                    const orderRef = doc(db, "orders", uid);
                    const orderSnap = await getDoc(orderRef);
                    if (docSnap.exists() && orderSnap.data()) {
                        orders = Object.values(orderSnap.data());
                    } else {
                        console.log("No such document!");
                    }

                    dispatch({
                        type: "SET_USER",
                        user: uid,
                        userDetails: userData,
                        orders: orders,
                    });
                    setLoading(false);
                } else {
                    dispatch({
                        type: "REMOVE_USER",
                        user: null,
                    });
                    setLoading(false);
                }
            });
        };

        retrieveDetail();
    }, [dispatch]);

    return (
        <Router>
            {!loading ? (
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/productPage" element={<ProductPage />} />
                    <Route
                        path="/cart"
                        element={
                            <Elements stripe={promise}>
                                <Cart />
                            </Elements>
                        }
                    />
                </Routes>
            ) : (
                <div className="app_loading">
                    <Loading />
                    <p
                        style={{
                            color: "orangered",
                            marginTop: "10px",
                            fontSize: "15px",
                            fontWeight: "700",
                        }}
                    >
                        Hold on a sec...
                    </p>
                </div>
            )}
        </Router>
    );
};

export default App;
