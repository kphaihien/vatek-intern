import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Task from './Task'
import SearchBar from './SearchBar'

function App() {
  const [list, setList] = useState([
    {id: 1, title: "Learn React", completed: true},
    {id: 2, title: "Build a Todo App", completed: false},
    {id: 3, title: "Master JavaScript", completed: false},
    { id: 4, title: "Master Nodejs", completed: false }
  ])

  const [inputTask, setInputTask] = useState("")
  const [typeSelected,setTypeSelected]=useState("all")
  const [searchValue, setSearchValue] = useState("")
  const [selectedTask, setSelectedTask] = useState(null)
  const filteredList = list.filter(task => {
    if (typeSelected === "active") {
      return !task.completed
    } else if (typeSelected === "completed") {
      return task.completed
    } else {
      return true
    }
  }).filter(task => task.title.toLowerCase().includes(searchValue.toLowerCase()))
  
  const returnTask=list.filter(task=>task.completed===false)
  
  const handleChangeInputTask = (e) => {
    setInputTask(e.target.value.trimStart())
  }
  
  
  const handleAddTask = () => {
    if (inputTask.trim().length === 0) {
      alert("Hãy thêm task")
      return;
    }
      setList([...list, { id: Date.now(), title: inputTask, completed: false }])
      setInputTask("")
  }

  const handleClearCompleted = () => {
    setList(list.filter(task => !task.completed))
  }

  const toogleTask=(id)=>{
    setList(list.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed }
      } else {
        return task
      }
    }))
  }
  const handleTickAll = () => {
    setList(list.map(task => ({ ...task, completed: true })))
  }
  const editTask=(id,newTitle)=>{
    setList(list.map(task => {
      if (task.id === id) {
        return { ...task, title: newTitle }
      } else {
        return task
      }
    }))
  }
  
  return (
    <>
      <section className='bg-[#5DCBCE] w-full h-screen flex items-center justify-center '>
        <div className='flex flex-col justify-start gap-2 w-[30%] h-[60%] p-8 bg-white rounded-md'>
          <div>
            <h1 className='text-3xl font-bold pb-2'>Todo App</h1>
            <div className='flex justify-between items-center gap-1'>
              <input onChange={handleChangeInputTask} value={inputTask} className='border-gray-100 border-2 w-[calc(100%-40px)] py-2 rounded-lg px-3' placeholder="Add a new todo..." />
              <button onClick={handleAddTask} className='bg-purple-500  text-white w-10 h-10 rounded-md p-2 font-extrabold'>+</button>
            </div>
          </div>
          <div className='flex justify-between items-center gap-2'>
            <button onClick={handleTickAll}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 cursor-pointer ">
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>

            <SearchBar setSearchValue={setSearchValue} />
          </div>
          <div className='flex flex-col gap-2 h-[70%] overflow-y-auto  '>
            {filteredList.map(task => <Task setSelectedTask={setSelectedTask} selectedTask={selectedTask}  
            key={task.id} task={task} toogleTask={toogleTask} editTask={editTask} />)}
          </div>
          <div className='flex flex-row justify-between items-center pt-2 text-sm'>
            <p>{returnTask.length>=1?`${returnTask.length} items`:`${returnTask.length} item`} left</p>
            <div className=' flex gap-3 items-center'>
              <button onClick={() => setTypeSelected("all")} className={`text-gray-500 cursor-pointer ${typeSelected === "all" ? "font-bold border-red-600 border-2 rounded-md p-2" : ""}`}>All</button>
              <button onClick={()=>setTypeSelected("active")}  className={`text-gray-500 cursor-pointer ${typeSelected === "active" ? "font-bold border-red-600 border-2 rounded-md p-2 " : ""}`}>Active</button>
              <button onClick={()=>setTypeSelected("completed")} className={`text-gray-500 cursor-pointer ${typeSelected === "completed" ? "font-bold border-red-600 border-2 rounded-md p-2" : ""}`}>Completed</button>
            </div>
            <button onClick={handleClearCompleted} className='cursor-pointer text-white bg-purple-500 px-2 py-1 rounded-sm'>Clear Completed</button>
          </div>
        </div>
      </section>

    </>
  )
}

export default App
