import { useEffect, useState } from "react";
import { useCreateUserMutation, useLazyGetUserQuery } from "../../api/apiSlice";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, IconButton, Paper, TextField, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const CreateUser = () => {
    const [createUser, {isLoading, isError, error}] = useCreateUserMutation();
    const [getUser] = useLazyGetUserQuery();
    const [username, setUsername] = useState("");
    const [created, setCreated] = useState(false);
    const [errmsg, setErrmsg] = useState("");
    const navigate = useNavigate();

    const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrmsg("");
        try {
            const check = await getUser(username).unwrap();
            if (check) {
                setErrmsg("Username already exists");
                console.log(errmsg);
                return;
            }
        } catch (err) {
            try {
                const res = await createUser({"name": username}).unwrap();
                console.log(res.name + " has been created");
                setUsername(res.name);
                setCreated(true);
            } catch (err) {
                setErrmsg((err as Error).message);
                console.log(errmsg);
                return;
            }
        }

        
    }

    const handleLogNav = () => {
        setCreated(false);
        navigate("/login", {replace: true});
    }

    
    const creatingUI = (
            <div 
                onClick={e => e.stopPropagation()}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "55%",
                    height: "65%",
                    flexDirection: "column",
                    position: 'relative',
                    zIndex: 12,
                    minWidth: "550px"
            }}>
                <Paper 
                    variant="outlined"
                    sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "white",
                    flexDirection: "column",
                    position: 'relative',
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    zIndex: 12
                }}>
                    <IconButton
                        onClick={handleLogNav}
                        sx={{
                            width: 40,
                            height: 40,
                            position: "absolute",
                            top: 10,
                            right: 10,
                            borderRadius: '50%',
                            padding: 0,
                            backgroundColor: 'lightgrey', 
                            '&:hover': {
                            backgroundColor: 'gray',  
                            },
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <form 
                        onSubmit={handleCreate}
                        style={{
                            width: "65%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            gap: 1
                        }}
                    >
                        <Typography variant="h4"> Join Our Community</Typography>
                        <TextField
                            label="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            margin="normal"
                            sx={{
                                width: "100%",
                                marginTop: 4,
                            }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            className="mui-button"
                            sx={{
                                width: "100%"
                            }}
                        >
                            Create Account
                        </Button>
                        {errmsg && (
                            <Alert severity="error" className="mui-alert" style={{ marginTop: "1rem", width: "100%" }}>
                                {errmsg}
                            </Alert>
                        )}
                    </form>

                </Paper>
            </div>
        
    )

    const createdUI = (
        <div
        style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: "45px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            zIndex: 12,
            width: "70%",
            maxWidth: "450px",
        }}
    >
        <Typography variant="h4" sx={{ marginBottom: 3.4, textAlign: "center" }}>
            {username} has been successfully created.
        </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: 1.5, textAlign: "center", color: "gray" }}>
            Welcome! You can now log in with your new account.
        </Typography>
        <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{
                width: "90%",
                padding: "12px",
            }}
            onClick={handleLogNav}
        >
            Back to Login Page
        </Button>
    </div>
    )
    

    return (
        <div 
            onClick={handleLogNav}
            style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10
            }}
        >
            {created
            ? createdUI
            : creatingUI}
        </div>)
        
}

export default CreateUser;