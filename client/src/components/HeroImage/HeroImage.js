import React, { useState, useEffect } from "react";
import { getFeatured, updateCart } from "../../utils/FirebaseData";
import { useNavigate } from "react-router-dom";
import { useStateValue } from "../../StateProvider";
import Loading from "../Loading";
import "../HeroImage/HeroImage-styles.css";

const HeroImage = () => {
    const [{ user, userDetails }, dispatch] = useStateValue();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const initial = {
        name: "",
        description: "",
        id: "",
        price: "",
        rating: "",
        image: "",
    };
    const [featured, setFeatured] = useState(initial);

    useEffect(() => {
        setLoading(true);
        const fetchFeatured = async () => {
            setFeatured(await getFeatured());
        };

        fetchFeatured();
        setLoading(false);
    }, []);

    const addToCart = () => {
        if (user === null) {
            navigate("/login");
        } else if (userDetails?.cart.length === 10) {
            alert("Cannot add more than 10 items in cart.");
        } else {
            try {
                updateCart(userDetails?.cart, featured, user);
                dispatch({
                    type: "ADD_TO_CART",
                    product: featured,
                });
            } catch (error) {
                console.log(error.message);
            }
        }
    };

    return (
        <div className="heroImage">
            {loading ? (
                <Loading />
            ) : (
                <div className="heroImage_contents">
                    <div className="heroImage_left">
                        <h2 className="heroImage_title">{featured.name}</h2>
                        <h1 className="heroImage_price">
                            {" "}
                            <sup>₹</sup> {featured.price}/- Only
                        </h1>
                        <p className="heroImage_description">
                            {featured.description}
                        </p>
                        <p className="heroImage_addToCart" onClick={addToCart}>
                            Add To Cart &rarr;
                        </p>
                    </div>
                    <div className="heroImage_right">
                        <img src={featured.image} alt="" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeroImage;
