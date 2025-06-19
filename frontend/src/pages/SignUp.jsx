import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Card.jsx";
import { showToast } from "../helper/getTostify.js";
import { isLoggedIn } from "../helper/isLogedin.js";
import { getEnv } from "../helper/getEnv.js";
import { rootRoute, signinRoute } from "../helper/routeName.js";

function Signup() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  useEffect(() => {
    isLoggedIn()
      .then((result) => {
        if (result) {
          console.log('result ' , result);
          
          showToast("info", "User already logged in");
          navigate(rootRoute);
        }
      })
      .catch(() => {
        
      });
  }, []);

  const handleSignUp = async () => {
  if (!fullname || !email || !password) {
    return showToast("error", "Please fill all the fields");
  }

  try {
    setLoading(true);

    const response = await axios.post(
      `${getEnv("VITE_BACKEND_URI")}/user/signup`,
      { email, fullname, password }
    );

    const { success, msg } = response.data;

    if (success) {
      showToast("success", "Signup successful, please login");
      navigate(signinRoute);
      return;
    } else {
      showToast("error", msg || "Signup failed");
    }
  } catch (error) {
    const msg = error?.response?.data?.msg || "Something went wrong";
    showToast("error", msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>

      <Card>
        <h1 className="text-4xl font-bold text-white text-center border-1 border-amber-50 p-2 px-5 rounded-xl">
          PayMe
        </h1>
        <h1 className="text-4xl">Registration</h1>
        <p className="text-lg text-center">
          Enter your information to create your account
        </p>

        <div>
          <h2>Fullname</h2>
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="px-2 rounded-md py-0.5 w-64 font-normal outline-hidden border-1 border-amber-50 text-white"
            type="text"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <h2>Email</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 rounded-md py-0.5 w-64 font-normal outline-hidden border-1 border-amber-50 text-white"
            type="text"
            placeholder="demo@gmail.com"
          />
        </div>

        <div>
          <h2>Password</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 rounded-md py-0.5 w-64 font-normal outline-hidden border-1 border-amber-50 text-white"
            placeholder="Enter your password..."
          />
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="text-xl bg-black p-2 rounded-lg border-slate-300 border-2 text-slate-300 mt-2 disabled:opacity-50"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        <p className="text-sm mt-2">
          Already have an account?
          <Link to="/signin">
            <span className="underline text-blue-300 ml-1">Login</span>
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Signup;

