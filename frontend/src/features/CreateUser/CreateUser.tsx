import { useEffect, useState } from "react";
import { useCreateUserMutation, useLazyGetUserQuery } from "../../api/apiSlice";
import { useNavigate } from "react-router-dom";

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

    const handleLogNav = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setCreated(false);
        navigate("/login", {replace: true});
    }
    
    const creatingUI = (
        <div>
            <div>Create Your username</div>
            <form onSubmit={handleCreate}>
                <label>
                    Username: 
                    <input 
                        type = "text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />
                    <button type="submit" >
                        Create
                    </button>
                </label>
            </form>
            <div>{errmsg}</div>
        </div>
    )

    const createdUI = (
        <div>
            <div>{username + " has been successfully created."}</div>
            <button type="button" onClick={handleLogNav}>Back to Login Page</button>
        </div>
    )
    

    return created
            ? createdUI
            : creatingUI;
}

export default CreateUser;