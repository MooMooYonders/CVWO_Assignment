import React, { useEffect, useState } from "react";
import { useCreateUserMutation, useGetPagesQuery, useGetUserQuery, useLazyGetUserQuery } from "../../api/apiSlice";
import { changeAuth, changeName, selectAuth } from "../auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Outlet, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
} from "@mui/material";

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
        navigate("/login/createuser", {replace: true});
    }


    useEffect(() => {
      if (isauth) {
        navigate("/home/central", {replace: true})
      }
    }, [isauth, navigate])

   

    return (
        (<Container maxWidth="sm" className="mui-container">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
              >
                <Typography variant="h4" className="mui-typography" gutterBottom>
                  Welcome to the Math Forum
                </Typography>
                <form 
                  onSubmit={handleLogin} 
                  className="mui-form"
                >
                  <TextField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    margin="normal"
                    fullWidth
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    className="mui-button"
                    fullWidth
                  >
                    Login
                  </Button>
                </form>
                {err && (
                  <Alert severity="error" className="mui-alert" style={{ marginTop: "1rem", width: "100%" }}>
                    {err}
                  </Alert>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  className="mui-button-outlined"
                  onClick={handleNavCreate}
                  sx={{
                    width: "40%",
                    marginTop: 3
                  }}
                >
                  Create User
                </Button>

                <Outlet/>
              </Box>
            </Container>
           )
        )
}

export default Login;