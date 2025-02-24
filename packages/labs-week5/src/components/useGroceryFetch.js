import { useState, useEffect } from "react"
import { groceryFetcher } from "./groceryFetcher";



export const useGroceryFetch = (source) => {
    const [error, setError] = useState(null);
    const [groceryData, setGroceryData] = useState([]);
  

    useEffect( ()  =>  {
        let isStale = false;

        async function fetchData(name) {
            setGroceryData([]);
            setError(null);
            setIsLoading(true);
            try {
                await delayMs(2000); // Wait before fetching
                const data = await groceryFetcher.fetch(source)
                
               
                console.log(data[0].name);
                if (!isStale){
                     setGroceryData(data); // Update state with fetched data

                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                if (!isStale){
                    setError(error);

                }
            } finally {
                if (!isStale){
                     setIsLoading(false); // Ensure loading state is turned off

                }
            }
        }
        const firstRun = async () => {
            const data =  await groceryFetcher.fetch(source);
            setGroceryData(data);
        }
        firstRun();

        return () => {
            isStale = true;
        }

    }, [source])

    return {groceryData, error}

}