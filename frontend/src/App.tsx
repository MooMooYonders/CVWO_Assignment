import { Navigate, useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./app/hooks"
import { changeAuth, changeName, selectAuth, selectName } from "./features/auth/authSlice"
import { useEffect } from "react"


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
    
  return isauth
        ? <Navigate to="/home" replace/>
        : <Navigate to="/login" replace/>
     
}



export default App
