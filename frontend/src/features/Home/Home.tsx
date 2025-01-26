import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useEffect, useState } from "react";
import { useUpdateCommentsUserLastSeenMutation } from "../../api/apiSlice";
import { Box, createTheme, ThemeProvider } from "@mui/material";

/*
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#48b5a3',
    },
    secondary: {
      main: '#3a56d2',
    },
    error: {
      main: '#ea2727',
    },
    background: {
      default: '#d8f1ee',
      paper: '#f9fbfa',
    },
    text: {
      primary: 'rgba(0,0,0,0.87)',
    },
    divider: 'rgba(251,248,248,0.12)',
  },
  typography: {
    fontSize: 13,
  },
}
);
*/

const theme = createTheme({
  palette: {
    primary: {
      main: "#2caed9", 
      contrastText: "#FFFFFF", 
    },
    secondary: {
      main: "#81D4FA", 
      contrastText: "#0D47A1", 
    },
    background: {
      default: "#F5F5F5", 
      paper: "#FFFFFF", 
    },
    text: {
      primary: "#212121", 
      secondary: "#757575", 
    },
    error: {
      main: "#D32F2F", 
    },
    warning: {
      main: "#FF9800", 
    },
    info: {
      main: "#0288D1", 
    },
    success: {
      main: "#388E3C", 
    },
  },
  typography: {
    fontFamily: "Roboto, 'KaTeX_Main', sans-serif", 
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: "#0D47A1",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: "#0D47A1",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 600,
      color: "#0D47A1",
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      color: "#212121",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      color: "#424242",
    },
    button: {
      fontWeight: 600,
      textTransform: "capitalize",
    },
  },
  
});


const Home: React.FC= () => {
    const location = useLocation();
    const [updatenotif, setUpdatenotif] = useState("");
    const [UpdateCommentsUserLastSeen] = useUpdateCommentsUserLastSeenMutation();

    useEffect(() => {
        const handleUpdateCommentsUserLastSeen = async () => {
            try {
                await UpdateCommentsUserLastSeen(updatenotif);
            } catch (err) {
                console.log((err as Error).message);
            }
        }


        const loc_arr = location.pathname.split("/");
        if (updatenotif !== "" && !loc_arr.includes("createcomment") && !loc_arr.includes("createreply")) {
            handleUpdateCommentsUserLastSeen();
        }
        if (loc_arr.length == 4 && loc_arr.includes("undefined")) {
            setUpdatenotif(loc_arr[3]);
        } else {
            setUpdatenotif("");
        }

        
    }, [location.pathname]);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100vh",
            }}>
              
              <Navbar/>
             
              <Box sx={{
                flexGrow: 1,
                height: "90%"
                }}>
                <Outlet/>
              </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Home;