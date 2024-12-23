import { BrowserRouter, Route, Routes } from "react-router";
import { store } from './redux/Store'
import { Provider } from "react-redux";
import Ragistration from "./components/auth/Ragistration";
import "./App.css"
import Login from "./components/auth/Login";
import ForgetPassword from "./components/auth/ForgetPassword";
import NewPassword from "./components/auth/NewPassword";
import DashboardLayout from "./components/dashboard/dashbordlayout/DashboardLayout";
import Opt from "./components/auth/Opt";

import BankDetailsForm from "./components/dashboard/dashbordlayout/BankDetailsForm";
import Profile from "./components/dashboard/dashbordlayout/Profile";
import { generateToken, messaging } from "./firebase/Firebase"
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import toast, { Toaster } from 'react-hot-toast';
import AddPrice from "./components/dashboard/addprice/AddPrice";


function App() {
  useEffect(() => {
    generateToken();
    onMessage(messaging, (payload) => {      
      toast.success(payload.notification.body);
     
    });
  }, [])

  return (

    <>
      <div>
        <Toaster
          position="top-center"
         
        />
      </div>

      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/ragistration" element={<Ragistration />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/opt" element={<Opt />} />
            <Route path="/newpassword" element={<NewPassword />} />
            <Route path="/*" element={<DashboardLayout />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/shopdetails" element={<ShopDetailsForm />} /> */}
            <Route path="/bankdetails" element={<BankDetailsForm />} />
           
            

          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
