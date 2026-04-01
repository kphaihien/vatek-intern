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
      if (typeSelected === 'active') return !task.completed;
      else if (typeSelected === 'completed') return task.completed;
      else return true;
    })
    .filter((task) => task.title.toLowerCase().includes(searchValue.toLowerCase()));

  const returnTask = list.filter((task) => task.completed === false);

  const handleChangeInputTask = (e) => setInputTask(e.target.value.trimStart());

  const handleAddTask = () => {
    if (inputTask.trim().length === 0) {
      alert('Hãy thêm task');
      return;
    }
    socketRef.current.emit('sendFromClient', inputTask);
    setInputTask('');
  };

  const handleClearCompleted = () => setList(list.filter((task) => !task.completed));
  const toogleTask = (id) => socketRef.current.emit('doneTaskFromClient', id);
  const handleTickAll = () => setList(list.map((task) => ({ ...task, completed: true })));
  const editTask = (id, newTitle) => socketRef.current.emit('editTaskFromClient', { id, newTitle });

  const socketRef = useRef();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    socketRef.current = io(socketHost, { auth: { email: user?.email } });
    socketRef.current.on('sendFromServer', (data) => {
      setList((old) => [
        ...old,
        { id: data.id, title: data.msg, completed: false, emailSender: data.emailSender },
      ]);
    });
    socketRef.current.on('doneTaskFromServer', (data) => {
      setList((prev) =>
        prev.map((task) => (task.id === data.msg ? { ...task, completed: !task.completed } : task))
      );
    });
    socketRef.current.on('editTaskFromServer', (data) => {
      setList((prev) =>
        prev.map((task) => (task.id === data.id ? { ...task, title: data.newTitle } : task))
      );
    });
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-[#5DCBCE] px-4 py-8">
      <div className="flex w-full max-w-lg flex-col justify-start gap-2 rounded-md bg-white p-4 sm:h-[60vh] sm:max-w-2xl sm:p-8">
        <div>
          <h1 className="pb-2 text-2xl font-bold sm:text-3xl">{t('todo.title')}</h1>
          <div className="flex items-center justify-between gap-1">
            <input
              onChange={handleChangeInputTask}
              value={inputTask}
              className="w-[calc(100%-44px)] rounded-lg border-2 border-gray-100 px-3 py-2"
              placeholder={t('todo.placeholder')}
            />
            <button
              onClick={handleAddTask}
              className="h-10 w-10 shrink-0 transform cursor-pointer rounded-md bg-purple-500 p-2 font-extrabold text-white transition hover:scale-105"
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
              className="size-8 cursor-pointer"
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

        <div className="flex max-h-60 flex-col gap-2 overflow-y-auto sm:h-[70%] sm:max-h-none">
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

        <div className="flex flex-col gap-2 pt-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600">
            {returnTask.length >= 1
              ? `${returnTask.length}${t('todo.itemsLeft')}`
              : `${returnTask.length}${t('todo.itemLeft')}`}
          </p>

          <div className="flex items-center justify-center gap-2">
            {['all', 'active', 'completed'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeSelected(type)}
                className={`cursor-pointer rounded-md px-2 py-1 text-xs text-gray-500 sm:text-sm ${
                  typeSelected === type ? 'border-2 border-red-600 font-bold' : ''
                }`}
              >
                {t(`todo.filter${type.charAt(0).toUpperCase() + type.slice(1)}`)}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearCompleted}
            className="cursor-pointer self-end rounded-sm bg-purple-500 px-2 py-1 text-xs text-white sm:self-auto sm:text-sm"
          >
            {t('todo.clearCompleted')}
          </button>
        </div>
      </div>
    </section>
  );
}

export default ToDoApp;
