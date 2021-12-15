import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase";
import "../Navbar/Navbar-styles.css";

const Navbar = () => {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [{ user, userDetails }, dispatch] = useStateValue();
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            setCurrentUser(userDetails);
        };
        fetchUserDetails();
    }, [dispatch, user, userDetails?.cart, userDetails]);

    const navbarClick = () => {
        setNavbarOpen(!navbarOpen);
    };

    const signOutAction = () => {
        signOut(auth)
            .then(() => {
                // Sign-out successful.
                dispatch({
                    type: "REMOVE_USER",
                    user: null,
                });
            })
            .catch((error) => {
                // An error happened.
            });
    };

    return (
        <div className={`navbar ${navbarOpen ? "navbar_show" : "navbar_hide"}`}>
            <div className="navbar_contents">
                <div className="navbar_logo">
                    <Link
                        to="/"
                        style={{ textDecoration: "none", color: "orangered" }}
                    >
                        <h2>shophub</h2>
                    </Link>
                    <span className="navbar_toggle" onClick={navbarClick}>
                        <p></p>
                        <p></p>
                        <p></p>
                    </span>
                </div>
                <ul
                    className={`navbar_items ${
                        navbarOpen ? "navbar_showItem" : "navbar_hideItem"
                    }`}
                >
                    <li className="navbar_item">
                        <Link
                            to="/orders"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "orangered",
                            }}
                        >
                            <i className="material-icons">shopping_bag</i>
                            Orders
                        </Link>
                    </li>
                    <li className="navbar_item">
                        <Link
                            to="/cart"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                textDecoration: "none",
                                color: "orangered",
                            }}
                        >
                            <i className="material-icons">shopping_cart</i>
                            {currentUser === null
                                ? "0"
                                : currentUser?.cart?.length}
                        </Link>
                    </li>
                    <li className="navbar_item">
                        {currentUser === null ? (
                            <span className="navbar_userName">
                                <p>Hello! Guest User</p>
                                <strong>
                                    <Link
                                        to="/login"
                                        style={{
                                            textDecoration: "none",
                                        }}
                                    >
                                        <strong className="navbar_auth">
                                            Sign In
                                        </strong>
                                    </Link>
                                </strong>
                            </span>
                        ) : (
                            <span className="navbar_userName">
                                <p>Hello! {currentUser?.name}</p>
                                <strong
                                    className="navbar_auth"
                                    onClick={signOutAction}
                                >
                                    Sign Out
                                </strong>
                            </span>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
