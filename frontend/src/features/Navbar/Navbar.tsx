import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCreatePageMutation, useGetPagesQuery } from "../../api/apiSlice";
import Pages from "../Pages/Pages";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changeAuth, changeName, selectName } from "../auth/authSlice";

const Navbar: React.FC = () => {
    type Page = {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
    }
    const {data, isLoading, isError, error} = useGetPagesQuery(undefined);
    const username = useAppSelector(selectName);    
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = (event: React.FormEvent<HTMLButtonElement>) => {
        dispatch(changeAuth(false));
        dispatch(changeName(""));
        navigate("/", {replace:true});
    }

    if (isLoading) return <div>Loading...</div>
    if (isError) return <div>Error: {"An error occurred"}</div>

    return (
        <nav>
            <div>{"Welcome home " + username}</div>
            <ul>
                {data?.map((page: Page) => (
                    <li key={page.id}>
                        <NavLink to={"/home/"+page.name}>{page.name}</NavLink>
                    </li>
                ))} 
            </ul>
            <button type="button" onClick={handleLogout}>Logout</button>
        </nav>
    )
}

export default Navbar