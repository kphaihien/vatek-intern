import { useEffect, useState } from 'react';
import Task from '../components/Task';
import SearchBar from '../components/SearchBar';
import { mockDataTodo } from '../data/mockData';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { useRef } from 'react';
import socketHost from '../utils/socketHost';
import { useSelector } from 'react-redux';
function ToDoApp() {
  const { t } = useTranslation();
  const [list, setList] = useState(mockDataTodo);
  const [inputTask, setInputTask] = useState('');
  const [typeSelected, setTypeSelected] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  const filteredList = list
    .filter((task) => {
      if (typeSelected === 'active') {
        return !task.completed;
      } else if (typeSelected === 'completed') {
        return task.completed;
      } else {
        return true;
      }
    })
    .filter((task) => task.title.toLowerCase().includes(searchValue.toLowerCase()));

  const returnTask = list.filter((task) => task.completed === false);

  const handleChangeInputTask = (e) => {
    setInputTask(e.target.value.trimStart());
  };

  const handleAddTask = () => {
    if (inputTask.trim().length === 0) {
      alert('Hãy thêm task');
      return;
    }
    socketRef.current.emit('sendFromClient', inputTask);
    // setList([...list, { id: Date.now(), title: inputTask, completed: false }]);
    setInputTask('');
  };

  const handleClearCompleted = () => {
    setList(list.filter((task) => !task.completed));
  };

  const toogleTask = (id) => {
    socketRef.current.emit('doneTaskFromClient', id);
  };
  const handleTickAll = () => {
    setList(list.map((task) => ({ ...task, completed: true })));
  };
  const editTask = (id, newTitle) => {
    setList(
      list.map((task) => {
        if (task.id === id) {
          return { ...task, title: newTitle };
        } else {
          return task;
        }
      })
    );
  };
  const socketRef = useRef();
  const [emailSender, setEmailSender] = useState(null);
  const user = useSelector((state) => state.user);
  console.log(user);

  useEffect(() => {
    // socketRef.current=socketIOClient.connect(socketHost)
    socketRef.current = io(socketHost, {
      auth: {
        email: user?.email,
      },
    });
    socketRef.current.on('sendFromServer', (data) => {
      setList((oldList) => [
        ...oldList,
        { id: data.id, title: data.msg, completed: false, emailSender: data.emailSender },
      ]);
    });
    socketRef.current.on('doneTaskFromServer', (data) => {
      setList((prevList) =>
        prevList.map((task) => {
          if (task.id === data.msg) {
            return { ...task, completed: !task.completed };
          }
          return task;
        })
      );
    });
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <>
      <section className="bg-[#5DCBCE] w-full h-screen flex items-center justify-center ">
        <div className="flex flex-col justify-start gap-2 w-[40%] h-[60%] p-8 bg-white rounded-md">
          <div>
            <h1 className="pb-2 text-3xl font-bold">{t('todo.title')}</h1>
            <div className="flex items-center justify-between gap-1">
              <input
                onChange={handleChangeInputTask}
                value={inputTask}
                className="border-gray-100 border-2 w-[calc(100%-40px)] py-2 rounded-lg px-3"
                placeholder={t('todo.placeholder')}
              />
              <button
                onClick={handleAddTask}
                className="w-10 h-10 p-2 font-extrabold text-white transition transform bg-purple-500 rounded-md cursor-pointer hover:scale-105"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div onClick={handleTickAll}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="cursor-pointer size-8 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 12.75 3 3m0 0 3-3m-3 3v-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>

            <SearchBar setSearchValue={setSearchValue} />
          </div>
          <div className="flex flex-col gap-2 h-[70%] overflow-y-auto  ">
            {filteredList.map((task) => (
              <Task
                setSelectedTask={setSelectedTask}
                selectedTask={selectedTask}
                key={task.id}
                task={task}
                toogleTask={toogleTask}
                editTask={editTask}
                emailUser={user?.email || 'Không xác định'}
              />
            ))}
          </div>
          <div className="flex flex-row items-center justify-between pt-2 text-sm">
            {/* <p>{returnTask.length >= 1 ? `${returnTask.length} items` : `${returnTask.length} item`} left</p> */}
            <p>
              {returnTask.length >= 1
                ? `${returnTask.length}${t('todo.itemsLeft')}`
                : `${returnTask.length}${t('todo.itemLeft')}`}
            </p>
            <div className="flex items-center gap-3 ">
              <button
                onClick={() => setTypeSelected('all')}
                className={`text-gray-500 cursor-pointer ${typeSelected === 'all' ? 'font-bold border-red-600 border-2 rounded-md p-2' : ''}`}
              >
                {t('todo.filterAll')}
              </button>
              <button
                onClick={() => setTypeSelected('active')}
                className={`text-gray-500 cursor-pointer ${typeSelected === 'active' ? 'font-bold border-red-600 border-2 rounded-md p-2 ' : ''}`}
              >
                {t('todo.filterActive')}
              </button>
              <button
                onClick={() => setTypeSelected('completed')}
                className={`text-gray-500 cursor-pointer ${typeSelected === 'completed' ? 'font-bold border-red-600 border-2 rounded-md p-2' : ''}`}
              >
                {t('todo.filterCompleted')}
              </button>
            </div>
            <button
              onClick={handleClearCompleted}
              className="px-2 py-1 text-white bg-purple-500 rounded-sm cursor-pointer"
            >
              {t('todo.clearCompleted')}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default ToDoApp;
