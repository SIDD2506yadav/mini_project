import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../../utils/FirebaseAuth";
import Loading from "../Loading";
import { useStateValue } from "../../StateProvider";

const SignUp = () => {
    const [{ user }] = useStateValue();
    const navigate = useNavigate();
    if (user) {
        navigate("/");
    }
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [address3, setAddress3] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [reRepassword, setRePassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const completeDetails = () => {
        if (
            name.length === 0 ||
            phone.length === 0 ||
            address1.length === 0 ||
            address2.length === 0 ||
            address3.length === 0
        ) {
            setError("Please fill in all the fields");
            return false;
        }
        setError(null);
        return true;
    };

    const signUpAction = (e) => {
        e.preventDefault();
        try {
            if (completeDetails()) {
                if (
                    signUpUser(
                        email,
                        password,
                        reRepassword,
                        setLoading,
                        setError,
                        name,
                        phone,
                        address1,
                        address2,
                        address3
                    )
                ) {
                    navigate("/");
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login">
            <h1 className="login_heading">shophub</h1>
            <div className="login_contents">
                {/* <div className="login_left">
                    <img src={forLoginPage} alt="" />
                </div> */}
                <div className="login_right">
                    <div className="login_section">
                        <h1 className="login_brand">shophub</h1>
                        <p className="login_welcome">Welcome to shophub.</p>
                        <span className="login_newUser">
                            <small>Have an account?</small>{" "}
                            <Link
                                to="/login"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    textDecoration: "none",
                                }}
                            >
                                <small className="login_goToSignUp">
                                    Log In.
                                </small>
                            </Link>
                        </span>
                        <form className="login_form">
                            <span className="login_attributes">
                                <p>Name</p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter your full name."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </span>
                            <span className="login_attributes">
                                <p>Email</p>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email id."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </span>
                            <span className="login_attributes">
                                <p>Phone Number</p>
                                <input
                                    type="number"
                                    required
                                    placeholder="Enter your phone number."
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </span>
                            <span className="login_attributes">
                                <p>Address</p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Address Line 1."
                                    value={address1}
                                    onChange={(e) =>
                                        setAddress1(e.target.value)
                                    }
                                />
                            </span>
                            <span className="login_attributes">
                                <input
                                    type="text"
                                    required
                                    placeholder="Address Line 2."
                                    value={address2}
                                    onChange={(e) =>
                                        setAddress2(e.target.value)
                                    }
                                />
                            </span>
                            <span className="login_attributes">
                                <input
                                    type="text"
                                    required
                                    placeholder="Address Line 3."
                                    value={address3}
                                    onChange={(e) =>
                                        setAddress3(e.target.value)
                                    }
                                />
                            </span>
                            <span className="login_attributes">
                                <p>Password</p>
                                <input
                                    type="password"
                                    required
                                    placeholder="Enter your password."
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </span>
                            <span className="login_attributes">
                                <p>Re-Enter Password</p>
                                <input
                                    type="password"
                                    required
                                    placeholder="Re Enter your password."
                                    value={reRepassword}
                                    onChange={(e) =>
                                        setRePassword(e.target.value)
                                    }
                                />
                            </span>
                            <input
                                type="submit"
                                value={"Create New Account"}
                                className="login_loginButton"
                                onClick={(e) => signUpAction(e)}
                            />
                        </form>
                        {loading ? (
                            <span className="login_loading">
                                <Loading />
                                <p>Creating your account...</p>
                            </span>
                        ) : (
                            <></>
                        )}
                        {error === null ? (
                            <></>
                        ) : (
                            <p className="login_errorMessage">
                                !Warning: {error}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
