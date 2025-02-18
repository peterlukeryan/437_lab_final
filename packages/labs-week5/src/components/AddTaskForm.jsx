import { nanoid } from "nanoid";
import { useState } from "react"

export const AddTaskForm = (props) => {
    const [input, setUserInput] = useState("");
    const updateInput = (e) => {
        setUserInput(e.target.value);
    }
    const handleClick = () => {
        props.onNewTask({id: nanoid(), task: input, completed:false});
        setUserInput("");
        props.toggle();
    }
    return  <>
        <div className="flex gap-2">
        <input placeholder="New task name" className = "bg-gray-50 p-2.5" value={input} onChange={updateInput}/>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick} >Add task</button>
        </div>
   
    </>
}