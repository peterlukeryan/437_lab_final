import { MainLayout } from "../MainLayout.jsx";
import { useImageFetching } from "./useImageFetching.js";
import { useParams } from "react-router";

export function ImageDetails() {
    const { imageId } = useParams();
    console.log(imageId);
    const updatedId = "_" + imageId;
    const { isLoading, fetchedImages } = useImageFetching(imageId, 500);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    const imageData = fetchedImages;
    if (!imageData) {
        return <div><h2>Image not found</h2></div>;
    }

    return (
        <div>
            <h2>{imageData.name}</h2>
            <img className="ImageDetails-img" src={imageData.src} alt={imageData.name} />
        </div>
    )
}
