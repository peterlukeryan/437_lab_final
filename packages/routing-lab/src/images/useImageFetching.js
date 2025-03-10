import { useEffect, useState } from "react";

export function useImageFetching(imageId, delay = 1000) {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedImages, setFetchedImages] = useState([]);
    
    useEffect(() => {
        let isMounted = true; 
        const abortController = new AbortController(); 

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const url = imageId ? `/api/images?createdBy=${encodeURIComponent(imageId)}` : "/api/images";
                const response = await fetch(url, { signal: abortController.signal });

                if (!response.ok) throw new Error(`Error: ${response.statusText}`);

                const data = await response.json();

                setTimeout(() => {
                    if (isMounted) setFetchedImages(data);
                }, delay);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Failed to fetch images:", error);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false; 
            abortController.abort(); 
        };
    }, [imageId, delay]); 

    return { isLoading, fetchedImages };
}
