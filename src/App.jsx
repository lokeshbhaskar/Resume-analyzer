import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Result from './components/Result';
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, RouterProvider } from 'react-router-dom';
function App() {
  const router = createBrowserRouter(
    [
      ,
      {
        path: "/",

        element:
          <div>
            <Navbar />
            <Home />
          </div>
      },
      {
        path: "/result",
        element: <div>
          <Navbar />
          <Result />
        </div>
      }
    ]
  )

  return (
    <RouterProvider router={router} />
  )
}

export default App
