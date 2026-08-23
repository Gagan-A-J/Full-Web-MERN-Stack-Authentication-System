import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = ({ setUser }) => {

    const handleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(
                "/api/auth/google-login",
                {
                    token: credentialResponse.credential,
                },
                {
                    withCredentials: true,
                }
            );

            // Save token
            localStorage.setItem("token", res.data.token);

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            // Update user state
            if (setUser) {
                setUser(res.data.user);
            }

            // Show backend success message
            alert(
                res.data.message ||
                "Google Login Successful"
            );

            // Redirect after success
            window.location.href = "/home";

        } catch (err) {
            console.log("Google Login Error:", err);

            // Get backend error message
            const backendMessage =
                err.response?.data?.message;

            // Show backend message
            if (backendMessage) {
                alert(backendMessage);
            } else if (err.request) {
                alert(
                    "Unable to connect to the server. Please try again."
                );
            } else {
                alert(
                    "Google Login Failed. Please try again."
                );
            }
        }
    };

    const handleGoogleError = () => {
        alert(
            "Google authentication was cancelled or failed. Please try again."
        );
    };

    return (
        <div className="mt-4">
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleGoogleError}
        />
        </div>
    );
};

export default GoogleLoginButton;