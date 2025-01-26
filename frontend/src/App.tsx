import styles from "./App.css"
import { Link, Navigate, Outlet, BrowserRouter as  Route, Router, Routes, useNavigate } from "react-router-dom"
import Navbar from "./features/Navbar/Navbar"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { changeAuth, changeName, selectAuth, selectName } from "./features/auth/authSlice"
import { useEffect } from "react"
import Login from "./features/Login/Login"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: {
      main: '#1E90FF', // Dodger Blue
    },
    secondary: {
      main: '#FF6F61', // Coral Red
    },
    background: {
      default: '#F7F9FB', // Light Grayish-Blue
      paper: '#E0E4E8', // Light Gray
    },
    text: {
      primary: '#2C3E50', // Dark Blue-Gray
      secondary: '#7F8C8D', // Medium Gray
    },
    success: {
      main: '#28A745', // Green
    },
    warning: {
      main: '#FFC107', // Amber
    },
    error: {
      main: '#DC3545', // Red
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Clean and legible font for the forum
  },
});





const App = () => {
  const isauth = useAppSelector(selectAuth);
  const name = useAppSelector(selectName);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (name == "") {
      dispatch(changeName(""));
      dispatch(changeAuth(false));
      navigate("/login", {replace: true});
    }
  }, [isauth, name, navigate])
    
  return (<ThemeProvider theme={theme}>
        {isauth
        ? <Navigate to="/home" replace/>
        : <Navigate to="/login" replace/>}
      </ThemeProvider>
    )
}



export default App
