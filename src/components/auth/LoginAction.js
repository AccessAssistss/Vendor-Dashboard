import { useDispatch } from "react-redux";
import { setUserEmail, setUserLoginLoading } from "./UserSlice";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router";

export const useLoginApi = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (data) => {
        dispatch(setUserLoginLoading(true));
        try {
            const response = await axios.post(
                "https://apis.agrisarathi.com/vendor/VendorLogin",
                data
            );

            if (response.status === 200 && response.data.tokens) {
                const { access, refresh } = response.data.tokens;

                if (!access || !refresh) {
                    Swal.fire("Error", "Failed to retrieve tokens. Please try again.", "error");
                    return;
                }

                localStorage.setItem("access_token", access);
                localStorage.setItem("refresh_token", refresh);

                dispatch(setUserEmail(data?.email));
                navigate("/");
            } else {
                Swal.fire("Error", "Login failed. Please check your credentials.", "error");
            }
        } catch (error) {
            console.error("Error during login:", error);

            if (error.response) {
                Swal.fire("Error",  "Your email or password is incorrect.", "error");
            } else if (error.request) {
                Swal.fire("Error", "No response received from the server. Please check your internet connection.", "error");
            } else {
                Swal.fire("Error", "An error occurred while setting up the request.", "error");
            }
        } finally {
            dispatch(setUserLoginLoading(false));
        }
    };

    return { login };
};
