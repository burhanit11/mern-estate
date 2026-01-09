import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { signInSuccess } from "../redux/user/userSlice";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();

      //  Popup login
      const result = await signInWithPopup(auth, provider);

      //  Send to backend
      const res = await fetch("http://localhost:5000/api/user/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
        credentials: "include",
      });

      const data = await res.json();

      // 🔹 Update Redux
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.error("Popup error:", err);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default OAuth;
