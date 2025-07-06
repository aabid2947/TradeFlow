import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserDashBoard from "./pages/UserDashBoard"
import AdminDashBoard from './pages/AdminDashBoard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <UserDashBoard/> */}
   <AdminDashBoard/>
      
    </>
  )
}

export default App
