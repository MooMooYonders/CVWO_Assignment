import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCreatePostMutation, useCreateTagsMutation, useLazyGetPageQuery } from "../../api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { selectName } from "../auth/authSlice";
import CreateTag from "./CreateTag/CreateTag";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [createPost, {isLoading, isError, error}] = useCreatePostMutation();
    const [errmsg, setErrmsg] = useState("");
    const [sucmsg, setSucmsg] = useState("");
    const {pagename} = useParams<{pagename: string}>();
    const username = useAppSelector(selectName);
    const navigate = useNavigate();
    const [createTags] = useCreateTagsMutation();
    const [tags, setTags] = useState<string[]>([])
    

    const addTag = (newTag: string) => {
        for (var i=0; i < tags.length; i++) {
            if (newTag === tags[i]) {
                return
            }
        }
        setTags((prevTags) => [...prevTags, newTag]); 
    };
    

    const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrmsg("");

        if (tags.length <= 0) {
            setErrmsg("No tags used");
            console.log(errmsg);
            return;
        }
        
        const reqCreatePost = {
            "title": title,
            "content": content,
            "pagename": pagename,
            "username": username
        }

        const reqCreateTag = {
            "tags": tags
        }

        try {
            const res = await createPost(reqCreatePost).unwrap();
            console.log(res);
            setSucmsg("Post has been successfully created!")
        } catch (err) {
            setErrmsg((err as Error).message);
            console.log(errmsg);
        }

        try {
            const res = await createTags(reqCreateTag).unwrap();
            console.log(res);

        } catch(err) {
            setErrmsg((err as Error).message);
            console.log(errmsg);
        }
    }

    const handleBack = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        navigate("/home/"+pagename, {replace: true});
    }

    
    return (
        <div>
            <div>{sucmsg}</div>
            <form onSubmit={handleCreatePost}>
                <label>
                    Title: 
                    <input 
                        type = "text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Content: 
                    <input 
                        type = "text"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                    />
                </label>
                <button type='submit' >Create Post</button>
            </form>
            <div>{errmsg}</div>
            {tags.map((tag: string, index: number) => <div key={index}>{tag}</div>)}
            <CreateTag addTag={addTag} />
            <button type="button" onClick={handleBack}>Back to Page</button>
        </div>
    )
}

export default CreatePost;