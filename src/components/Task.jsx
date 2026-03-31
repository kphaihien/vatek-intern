import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
const Task = ({ task, setSelectedTask, selectedTask, toogleTask, editTask, emailUser }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const handleChooseTask = () => {
    setSelectedTask(task.id);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      editTask(task.id, newTitle);
    }
  };
  const handleEditing = () => {
    setIsEditing(!isEditing);
  };
  return (
    <>
      <div
        onClick={handleChooseTask}
        className={`flex items-center px-2 py-2 hover:cursor-pointer gap-2 rounded-sm ${selectedTask === task.id ? 'bg-purple-400 text-white' : 'bg-gray-200'}`}
      >
        <input
          onClick={(e) => e.stopPropagation()}
          onChange={() => toogleTask(task.id)}
          type="checkbox"
          checked={task.completed}
        />
        {!isEditing && (
          <>
            <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </span>
            <p className="ml-auto text-sm">
              {t('todo.createdBy')}
              {task?.emailSender || `${t('todo.undefined')}`}
            </p>
          </>
        )}

        {isEditing && (<>
          <input
            type="text"
            className="underline"
            onKeyDown={handleKeyDown}
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
          />
          <p className="ml-auto text-sm">
              {t('todo.createdBy')}
              {task?.emailSender || `${t('todo.undefined')}`}
            </p>
          </>
        )}
        {selectedTask === task.id && (
          <div onClick={handleEditing} className="font-bold text-black cursor-pointer ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
};

export default Task;
