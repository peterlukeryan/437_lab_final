import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import ReactDOM from 'react-dom'
import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { MainLayout } from "./MainLayout.jsx";
import { useEffect, useState } from "react";
import { useImageFetching } from "./images/useImageFetching.js";
import { ImageEditForm } from "./images/ImageEditForm.jsx";
import RegisterPage from "./auth/RegisterPage.jsx";
import LoginPage from "./auth/LoginPage.jsx";
import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";



function App() {
    const [userName, setUserName] = useState("");
    const [authToken, setAuthToken] = useState("");

    const updateUserName = (name) => {
        setUserName(name);
    }

   

console.log("Heres the token");
console.log(authToken);
if (!authToken){
    console.log("No auth token!");
}
else {
    console.log("Here's the token: " + authToken);
}
const { isLoading, fetchedImages } = useImageFetching("", 1000, authToken);
    return (
        <BrowserRouter>
  <Routes>
    <Route element={<MainLayout />}>
        <Route path="/" element={<ProtectedRoute authToken={authToken}><ImageEditForm/></ProtectedRoute>} />
        <Route path="images" element={<ProtectedRoute authToken={authToken}><ImageGallery isLoading={isLoading} fetchedImages={fetchedImages}/></ProtectedRoute>} />
        <Route path="account" element={<ProtectedRoute authToken={authToken}><AccountSettings toggle={updateUserName}/></ProtectedRoute>} />
        
      
        <Route path="/register" element={<RegisterPage setToken={setAuthToken} />} />
        <Route path="/login" element={<LoginPage setToken={setAuthToken} />} />

        <Route path="/images/:imageId" element={<ProtectedRoute authToken={authToken}><ImageDetails /></ProtectedRoute>} />
    </Route>
</Routes>

   </BrowserRouter>
    )
   
    // const POSSIBLE_PAGES = [
    //     <Homepage userName="John Doe" />,
    //     <AccountSettings />,
    //     <ImageGallery />,
    //     <ImageDetails imageId="0" />
    // ]

    // return POSSIBLE_PAGES[0];
}

export default App
