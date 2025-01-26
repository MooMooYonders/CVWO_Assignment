import { Alert, Box, Button, Paper, Snackbar, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePageMutation } from "../../api/apiSlice";

const CreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [pageerrmsg, setPageerrmsg] = useState("");
    const [sucmsg, setSucmsg] = useState("");
    const [pagename, setPagename] = useState("");
    const [usecreatepage] = useCreatePageMutation();
    const [severity, setSeverity] = useState<"error" | "warning" | "info" | "success">("success");

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    }

    const handleCreatePage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const req = {
                "name": pagename
            }
            const res = await usecreatepage(req).unwrap();
            console.log(res);
            setOpenSnackbar(true);
            setSeverity("success");
            setSucmsg("Successfully created page!");
        } catch (err) {
            setOpenSnackbar(true);
            setSeverity("error");
            setSucmsg((err as Error).message || "Unknown error occurred, make sure not to use the same name");
            console.log(sucmsg);
        }
    }

    const handleBack = () => {
        navigate("/home/central");
    }
    
    return (
        <>
            <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: 2,
                backgroundColor: "gray",
            }}
            >
                <Paper
                    variant="outlined"
                    sx={(theme) => ({
                    width: "90%",
                    maxWidth: "800px",
                    padding: theme.spacing(3),
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing(2),
                    [theme.breakpoints.down("sm")]: {
                        padding: theme.spacing(2),
                        gap: theme.spacing(1),
                    },
                    })}
                >
                    <Typography variant="h5" align="center">
                    Create Page
                    </Typography>
                    <form onSubmit={handleCreatePage}>
                    <TextField
                        required
                        label="Page Name"
                        value={pagename}
                        onChange={(e) => setPagename(e.target.value)}
                        error={!!pageerrmsg}
                        helperText={pageerrmsg}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Button variant="outlined" color="secondary" onClick={handleBack}>
                        Back
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                        Create Page
                        </Button>
                    </Box>
                    </form>
                </Paper>
            </Box>

            <Snackbar 
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={severity} 
                    sx={{ width: "100%" }}>
                    {sucmsg}
                </Alert>
            </Snackbar>
        </>
    )
}

export default CreatePage;