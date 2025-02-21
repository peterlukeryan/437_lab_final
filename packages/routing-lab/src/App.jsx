import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import ReactDOM from 'react-dom'
import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { useState } from "react";


function App() {
    const [userName, setUserName] = useState("");

    const updateUserName = (name) => {
        setUserName(name);
    }

    return (
        <BrowserRouter>
    <Routes>
        <Route path="/" element={<Homepage name={userName}/>}/>
        <Route path="images" element={<ImageGallery />}/>
        <Route path="account" element={<AccountSettings toggle={updateUserName}/>}/>
        <Route path="/images/:imageId" element={<ImageDetails />}/>


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
