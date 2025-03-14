import { useEffect, useState } from "react";

export function useImageFetching(imageId, delay = 1000, token) {
    console.log(token)
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState([]);
    
    useEffect(() => {
        let isMounted = true; 
    
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const url = `/api/images`
                const response = await fetch(url, {
                    method: "GET",  // or "POST", "PUT", etc.
                    headers: {
                        "Authorization": `Bearer ${token}`,  // Add the token here
                        "Content-Type": "application/json"  // Include if sending JSON data
                    }
                });
    
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
    
                const data = await response.json();
                console.log("Here is the data");
                console.log(data);
    
                setTimeout(() => {
                    if (imageId){
                        for (let image of data){
                            if (image._id == imageId){
                                setFetchedImages(image);
                            }
                        }
                    }
                    else {
                        if (isMounted) setFetchedImages(data);
                    }
                }, delay);
            } catch (error) {
                console.error("Failed to fetch images:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false; 
        };
    }, [imageId, delay, token]);
    

    return { isLoading, fetchedImages };
}
