import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetPagesQuery } from "../../api/apiSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changeAuth, changeName, selectName } from "../auth/authSlice";
import {AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Menu, ListItemButton, ThemeProvider} from "@mui/material";
  import { Menu as MenuIcon, Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Pageview as PageviewIcon } from "@mui/icons-material";
import theme from "../Theme/Theme";
import CreateIcon from '@mui/icons-material/Create';

type Page = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
}

const Navbar: React.FC = () => {

    const {data, isLoading, isError, error} = useGetPagesQuery(undefined);
    const username = useAppSelector(selectName);    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        dispatch(changeAuth(false));
        dispatch(changeName(""));
        setDrawerOpen(false);
        navigate("/", {replace:true});
    }

    const handleNavigation = (url: string) => {
        const helperNav = () => {
            setDrawerOpen(false);
            navigate(url);
        }
        return helperNav;
    }

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }
        setDrawerOpen(open);
      };
    
    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {"An error occurred"}</div>

    return (
      <ThemeProvider theme={theme}>
      <div style={{width: "100%"}}>
      
      <AppBar position="static" sx={{width: '100%', height: "100%", backgroundColor: theme.palette.primary.main}}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography  
            variant="h6" 
            sx={{ 
              flexGrow: 1,
              color: "white"
             }}
          >
            Math Forum
          </Typography>

          <Typography 
            variant="h6"
            sx={{
              color: "white"
            }}
          >
              {username}
            </Typography>
        </Toolbar>
      </AppBar>

      
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 250, height: "100%", overflowY: "auto" }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
          <Box sx={{ width: 250, bgcolor: 'primary.main'}} >
            <Typography variant="subtitle1" sx={{ padding: 2, fontWeight: "bold" }}>
              Pages
            </Typography>
          </Box>
          <List>
            <ListItemButton onClick={handleNavigation("/home/dashboard")}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            {username.toLowerCase() == "admin" && (<ListItemButton onClick={handleNavigation("/home/createpage")}>
              <ListItemIcon>
                <CreateIcon/>
              </ListItemIcon>
              <ListItemText primary="Create Page" />
            </ListItemButton>)}
            {data?.map((page: Page) => (
              <ListItemButton key={page.id} onClick={handleNavigation(`/home/${page.name}`)}>
                <ListItemIcon>
                  <PageviewIcon color="secondary"/>
                </ListItemIcon>
                <ListItemText primary={page.name} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon color="secondary"/>
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </div>
    </ThemeProvider>
    )
}

export default Navbar