import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Task from './components/Task'
import SearchBar from './components/SearchBar'
import ToDoApp from './pages/ToDoApp'
import { Outlet } from 'react-router-dom'
import { ConfigProvider } from 'antd'

function App() {
  return (
    <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8100D1',
        },
      }}
    >
      <Outlet/>
    </ConfigProvider>
    </>
  )
}

export default App
