import { React, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { groceryFetcher } from "./groceryFetcher";
import { Spinner } from "./Spinner";

const MDN_URL = "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json";

/**
 * Creates and returns a new promise that resolves after a specified number of milliseconds.
 *
 * @param {number} ms the number of milliseconds to delay
 * @returns {Promise<undefined>} a promise that resolves with the value of `undefined` after the specified delay
 */
function delayMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function GroceryPanel(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [groceryData, setGroceryData] = useState([]);
    const [dropdownVal, setDropdownVal] = useState("MDN");

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

                }
            } finally {
                if (!isStale){
                     setIsLoading(false); // Ensure loading state is turned off

                }
            }
        }
        const firstRun = async () => {
            const data =  await groceryFetcher.fetch(dropdownVal);
            setGroceryData(data);
        }
        firstRun();

        return () => {
            isStale = true;
        }

    }, [dropdownVal])

    
    
    function handleDropdownChanged(e){
        setDropdownVal(e.target.value);
        if (e.target.value === ""){
            

        }
        else {
            setDropdownVal(e.target.value);
        }
       

    }

    function handleAddTodoClicked(item) {
        const todoName = `Buy ${item.name} (${item.price.toFixed(2)})`;
        props.addTask({id: nanoid(), task: todoName, completed:false});
        
    }


    return (
        <div>
        
            <h1 className="text-xl font-bold">Groceries prices today</h1>
            <label className="mb-4 flex gap-4">
                Get prices from:
                <select className="border border-gray-300 p-1 rounded-sm disabled:opacity-50" disabled={isLoading} onChange={handleDropdownChanged} value={dropdownVal}>
                <option value="MDN">MDN</option>
<option value="Liquor store">Liquor store</option>
<option value="Butcher">Butcher</option>
<option value="whoknows">Who knows?</option>
                </select>
                {isLoading ? <Spinner /> : null}
                {error ? <h1>Error getting request</h1> : null}
            </label>

            {
                groceryData.length > 0 ?
                    <PriceTable items={groceryData} onAddClicked={handleAddTodoClicked} /> :
                    "No data"
            }
        </div>
    );
}

function PriceTable(props) {
    return (
        <table className="mt-4">
            <thead>
            <tr>
                <th className="text-left">Name</th>
                <th>Price</th>
            </tr>
            </thead>
            <tbody>
            {
                props.items.map(item =>
                    <PriceTableRow
                        key={item.name}
                        item={item}
                        onAddClicked={() => props.onAddClicked(item)}
                    />
                )
            }
            </tbody>
        </table>
    );
}

function PriceTableRow({item, onAddClicked}) {
    const buttonClasses = `italic px-2 rounded-sm border border-gray-300
        hover:bg-gray-100 active:bg-gray-200 cursor-pointer`;
    return (
        <tr>
            <td>{item.name}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>
                <button className={buttonClasses} onClick={onAddClicked}>
                    Add to todos
                </button>
            </td>
        </tr>
    );
}
