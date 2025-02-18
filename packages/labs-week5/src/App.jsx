import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { Todo } from './components/Todo';
import { AddTaskForm } from './components/AddTaskForm';
import { GroceryPanel } from './components/GroceryPanel';
import { Spinner } from './components/Spinner';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { Modal } from './components/Modal';

const element = <FontAwesomeIcon icon={faTrashCan} title='Trash can'/>
const INITIAL_TASK_LIST = [{id: nanoid(), task: "Eat", completed:false}, {id: nanoid(), task: "Sleep", completed:false}, {id:nanoid(), task: "Repeat", completed:false}];



function App() {
  const [tasks, setTasks] = useState(INITIAL_TASK_LIST);
  const [modalOpen, setModalOpen] = useState(false);

  const addTask = (task) => {
    let taskCopy = [...tasks, task];
    setTasks(taskCopy)
}

const toggleTaskCompleted = (id) => {
    const updatedTasks = tasks.map((task) => {
        console.log(task.id)
        if (task.id == id){
            console.log(task.id)
            return {...task, completed: !task.completed}
        }
        return task;
    })
 
    setTasks(updatedTasks);
}

const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => (
        task.id != id)
    )
 
    setTasks(updatedTasks);
}

const toggleModal = () => {
    setModalOpen(!modalOpen);
}

  return (
   
      <main className="m-4"> 

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => toggleModal()} >New Task</button>
          
          <Modal headerLabel={"Header"} isOpen={modalOpen} toggle={toggleModal}>
          <AddTaskForm onNewTask={addTask} toggle={toggleModal}/>
            
          </Modal>
          <section className="flex flex-col">
              <h1 className="text-xl font-bold">To do</h1>
              <ul>
                
                 {
                 tasks.map(task => 
                  <Todo name ={task.task} element = {element} key={task.id} toggle={toggleTaskCompleted} delete={deleteTask} id = {task.id}/>
                 )}
                 <GroceryPanel addTask={addTask} />
               
              </ul>
          </section>
      </main>
  );
}

export default App;
