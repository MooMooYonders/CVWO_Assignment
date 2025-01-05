import React from "react"
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useGetPagePostsQuery, useLazyGetPageQuery } from "../../api/apiSlice";
import Thread from "./Thread/Thread";

const Pages: React.FC = () => {
    const {pagename} = useParams<{pagename: string}>();
    const navigate = useNavigate();
    const {data, isLoading, isError} = useGetPagePostsQuery(pagename, {refetchOnMountOrArgChange: true});

    if (isLoading) {
        return <div>...Loading</div>
    }

    if (isError) {
        return <div>Error!</div>
    }

    type Post = {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        title: string;
        content: string;
        pagename: {
            String: string;
            Valid: boolean;
        }
        username: string;
    }

    const navCreate = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate("/home/" + pagename + "/createpost");
    }



    return (
        <div>
            <div>{"You have arrived at " + pagename}</div>
            <button type="button" onClick={navCreate}>Create Post</button>
            {data.map((post: Post)=> 
                <Thread 
                    key={post.id}
                    username={post.username}
                    title={post.title}
                    content={post.content}
                />
            )}
            <Outlet/>
        </div>
    )
}

export default Pages;