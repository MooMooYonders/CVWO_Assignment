import styles from "./App.css"
import { Link, Navigate, Outlet, BrowserRouter as  Route, Router, Routes, useNavigate } from "react-router-dom"
import Navbar from "./features/Navbar/Navbar"
import { useAppSelector } from "./app/hooks"
import { selectAuth } from "./features/auth/authSlice"
import { useEffect } from "react"
import Login from "./features/Login/Login"





const App = () => {
  const isauth = useAppSelector(selectAuth);
    
  return isauth
      ? <Navigate to="/home" replace/>
      : <Navigate to="/login" replace/>
}

export default App
