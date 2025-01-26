import { createBrowserRouter } from "react-router-dom";
import App from "../App"
import Login from "../features/Login/Login";
import Pages from "../features/Pages/Pages";
import Navbar from "../features/Navbar/Navbar";
import CreateUser from "../features/CreateUser/CreateUser";
import Home from "../features/Home/Home";
import Central from "../features/Central/Central";
import CreatePost from "../features/CreatePost/CreatePost";
import ThreadPage from "../features/PostPage/PostPage";
import PostPage from "../features/PostPage/PostPage";
import CreateComment from "../features/PostPage/CreateComment/CreateComment";
import Dashboard from "../features/Dashboard/Dashboard";
import CreatePage from "../features/CreatePage/CreatePage";


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
                path: "/home/createpage",
                element: <CreatePage />,
                children: [],
            },
            {
            path: "/home/central",
            element: <Central />,
            children: [],
            },
            {
            path: "/home/:pagename",
            element: <Pages />,
            children: [],
            },
            {
            path: "/home/:pagename/createpost",
            element: <CreatePost />,
            children: [],
            },
            {
            path: "/home/dashboard",
            element: <Dashboard />,
            children: [],
            },
            {
                path: "/home/:pagename/:post_id",
                element: <PostPage/>,
                children: [],
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
        children: [{
            path: "/login/createuser",
            element: <CreateUser/>,
            children: [],
        }],
    },
]);

