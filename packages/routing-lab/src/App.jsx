import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import ReactDOM from 'react-dom'
import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { MainLayout } from "./MainLayout.jsx";
import { useEffect, useState } from "react";



function App() {
    const [userName, setUserName] = useState("");

    const updateUserName = (name) => {
        setUserName(name);
    }

   
const IMAGES = [
    {
        id: "0",
        src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Blue_merle_koolie_short_coat_heading_sheep.jpg",
        name: "Blue merle herding sheep"
    },
    {
        id: "1",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/2560px-Huskiesatrest.jpg",
        name: "Huskies"
    },
    {
        id: "2",
        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg",
        name: "Shiba"
    },
    {
        id: "3",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/2560px-Felis_catus-cat_on_snow.jpg",
        name: "Tabby cat"
    },
    {
        id: "4",
        src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg",
        name: "Chickens"
    }
];

/**
 * Fetches images on component mount.  Returns an object with two properties: isLoading and fetchedImages, which will be
 * an array of ImageData
 *
 * @param imageId {string} the image ID to fetch, or all of them if empty string
 * @param delay {number} the number of milliseconds fetching will take
 * @returns {{isLoading: boolean, fetchedImages: ImageData[]}} fetch state and data
 */
 function useImageFetching(imageId, delay=1000) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState([]);
    useEffect(() => {
        setTimeout(() => {
            if (imageId === "") {
                setFetchedImages(IMAGES);
            } else {
                setFetchedImages(IMAGES.filter((image) => image.id === imageId));
            }
            setIsLoading(false);
        }, delay);
    }, [imageId]);

    return { isLoading, fetchedImages };
}

const { isLoading, fetchedImages } = useImageFetching("");
    return (
        <BrowserRouter>
    <Routes>
        <Route element={<MainLayout />}>
        <Route path="/" element={<Homepage name={userName}/>}/>
        <Route path="images" element={<ImageGallery isLoading={isLoading} fetchedImages={fetchedImages}/>}/>
        <Route path="account" element={<AccountSettings toggle={updateUserName}/>}/>
        <Route path="/images/:imageId" element={<ImageDetails />}/>
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
