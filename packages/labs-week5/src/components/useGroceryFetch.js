import { useState, useEffect } from "react"
import { groceryFetcher } from "./groceryFetcher";



export const useGroceryFetch = (source) => {
    const [error, setError] = useState(null);
    const [groceryData, setGroceryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    function delayMs(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    useEffect( ()  =>  {
        let isStale = false;

        async function fetchData(name) {
            setGroceryData([]);
            setError(null);
            setIsLoading(true);
            try {
                await delayMs(2000); // Wait before fetching
                const data = await groceryFetcher.fetch(name)
                console.log(data[0].name);
                if (!isStale){
                     setGroceryData(data); // Update state with fetched data

                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                if (!isStale){
                    setError(error);
                    setIsLoading(false);

                }
            } finally {
                if (!isStale){
                     setIsLoading(false); // Ensure loading state is turned off

                }
            }
        }
       
        fetchData(source);

        return () => {
            isStale = true;
        }

    }, [source])

    return {groceryData, isLoading, error}

}