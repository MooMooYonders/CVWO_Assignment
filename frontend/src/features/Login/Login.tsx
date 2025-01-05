import React, { useEffect, useState } from "react";
import { useCreateUserMutation, useGetPagesQuery, useGetUserQuery, useLazyGetUserQuery } from "../../api/apiSlice";
import { changeAuth, changeName, selectAuth } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [getUser] = useLazyGetUserQuery();
    const [username, setUsername] = useState("")
    const [err, setErr] = useState("")
    const isauth = useAppSelector(selectAuth);
    const dispatch = useAppDispatch()
    const navigate = useNavigate();


    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const data = await getUser(username).unwrap();
            dispatch(changeAuth(true));
            dispatch(changeName(data.name));
            console.log('user found: ', data.name);

        } catch (err) {
            console.log("Failed to log in", err);
            setErr("Failed to log in, please try again");
        }
    }

    const handleNavCreate = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate("/createuser", {replace: true});
    }


    useEffect(() => {
      if (isauth) {
        navigate("/home/central", {replace: true})
      }
    }, [isauth, navigate])

   

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label>
                    Username: 
                    <input 
                        type = "text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <button type="submit" >
                        Login
                    </button>
                </label>
            </form>
            <div>{err}</div>
            <button type="button" onClick={handleNavCreate}>Create User</button>
        </div>
        )
}

export default Login;