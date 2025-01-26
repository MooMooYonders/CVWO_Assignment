import { Box, Button, Icon, Paper, ThemeProvider, Typography } from "@mui/material";
import { useLazyGetPagesQuery } from "../../api/apiSlice";
import theme from "../Theme/Theme";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { selectName } from "../auth/authSlice";
import { useAppSelector } from "../../app/hooks";

type Page = {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
}

const Central: React.FC = () => {
    const [getpages] = useLazyGetPagesQuery();
    const navigate = useNavigate();
    const [pages, setPages] = useState<string[]>([])
    const username = useAppSelector(selectName); 

    const handlePages = async () => {
        try {
            const res = await getpages(undefined).unwrap();
            const pages = res.map((page: Page) => page.name);
            if (username.toLowerCase() == "admin") {
                setPages(["Dashboard", "CreatePage", ...pages]);
            } else {
                setPages(["Dashboard", ...pages]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        handlePages();
    }, [])

    const handleNav = (target: string) => {
        navigate(`/home/${target}`);
    }

    return (
        <ThemeProvider theme={theme}>
        <Box 
            sx={{ 
                padding: 4, 
                backgroundColor: "#f9f9f9", 
                minHeight: "100vh" 
        }}>
            <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom
            >
                Welcome to Your Homepage
            </Typography>

            <Typography 
                variant="body1" 
                sx={{ 
                    marginBottom: 6, 
                    color: "text.secondary",
                    fontSize: "1.1rem",
                    marginTop: 2,
                }}>
                Select a section to get started.
            </Typography>
    
          
            <Box
                sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 3,
                marginTop: 4
                }}
            >
                {pages.map((page: string, index: number) => (
                <Paper
                    key={index}
                    elevation={3}
                    onClick={() => handleNav(page.toLowerCase())}
                    sx={{
                    padding: 3,
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "0.3s",
                    "&:hover": {
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                        transform: "translateY(-4px)",
                    },
                    }}
                >
                    
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {page}
                    </Typography>
                
                </Paper>
                ))}
            </Box>
        </Box>
        </ThemeProvider>
    );
};
    

export default Central;