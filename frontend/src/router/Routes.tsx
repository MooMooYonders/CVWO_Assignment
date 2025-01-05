import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Login from "../features/Login/Login";
import Pages from "../features/Pages/Pages";
import Navbar from "../features/Navbar/Navbar";
import CreateUser from "../features/CreateUser/CreateUser";
import Home from "../features/Home/Home";
import Central from "../features/Central/Central";
import CreatePost from "../features/CreatePost/CreatePost";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [],
    },
    {
        path:"/home",
        element: <Home/>,
        children: [
            {
            path: "/home/central",
            element: <Central />,
            children: [],
            },
            {
            path: "/home/:pagename",
            element: <Pages />,
            children: [{
                path: "/home/:pagename/createpost",
                element: <CreatePost />,
                children: [],
            }],
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
        children: [],
    },
    {
        path: "/createuser",
        element: <CreateUser />,
        children: [],
    },
]);

