import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/FirebaseAuth";
import Loading from "../Loading";
import "./Login-styles.css";
import { useStateValue } from "../../StateProvider";

const Login = () => {
    const [{ user }] = useStateValue();
    const navigate = useNavigate();
    if (user) {
        navigate("/");
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginAction = async (e) => {
        e.preventDefault();
        const userId = loginUser(email, password, setLoading, setError);
        if (userId) {
            navigate("/");
        }
    };

    return (
        <div className="login">
            <h1 className="login_heading">shophub</h1>
            <div className="login_contents">
                <div className="login_right">
                    <div className="login_section">
                        <h1 className="login_brand">shophub</h1>
                        <p className="login_welcome">
                            Welcome back to shophub.
                        </p>
                        <span className="login_newUser">
                            <small>New here?</small>{" "}
                            <Link
                                to="/signup"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    textDecoration: "none",
                                }}
                            >
                                <small className="login_goToSignUp">
                                    Create an account.
                                </small>
                            </Link>
                        </span>
                        <form className="login_form">
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
                            <input
                                type="submit"
                                className="login_loginButton"
                                onClick={(e) => loginAction(e)}
                            />
                        </form>
                        {loading ? (
                            <span className="login_loading">
                                <Loading />
                                <p>Logging In...</p>
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

export default Login;
