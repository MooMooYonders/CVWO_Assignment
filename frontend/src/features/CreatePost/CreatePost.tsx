import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { dbApi, useCreatePostMutation, useCreatePostTagsMutation, useCreateTagsMutation, useLazyGetPageQuery, useLazyGetTagsByPageQuery } from "../../api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { selectName } from "../auth/authSlice";
import { Alert, Autocomplete, Box, Button, Paper, Snackbar, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";



const CreatePost: React.FC = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [createPost] = useCreatePostMutation();
    const [tagerrmsg, setTagErrmsg] = useState("");
    const [posterrmsg, setPostErrmsg] = useState("");
    const [posttagerrmsg, setPostTagErrmsg] = useState("");
    const [sucmsg, setSucmsg] = useState("");
    const {pagename} = useParams<{pagename: string}>();
    const username = useAppSelector(selectName);
    const navigate = useNavigate();
    const [createTags] = useCreateTagsMutation();
    const [tags, setTags] = useState<string[]>([])
    const [createPostTags] = useCreatePostTagsMutation();
    const dispatch = useAppDispatch();
    const [tagoptions, setTagOptions] = useState<string[]>([]);
    const [getTagsByPage] = useLazyGetTagsByPageQuery();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    
    const handleCloseSnackbar = () => {
        setOpenSnackbar(true);
    }

    useEffect(() => {
        getTags();
    }, [])
    
    const getTags = async () => {
        try {
            const tags = await getTagsByPage(pagename).unwrap();
            setTagOptions(tags.length > 0? tags : []); 
        } catch (err) {
            console.log((err as Error).message);
        }
   }

    const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setTagErrmsg("");
        setPostErrmsg("");
        setPostTagErrmsg("");

        const tag_ids: number[]= [];
        let post_id = "";

        if (tags.length <= 0) {
            setTagErrmsg("No tags used");
            console.log(tagerrmsg);
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
            post_id = res.id;
            setSucmsg("Post has been successfully created!")
            try {
                type tag_entry = {
                    id: string;
                    name: string;
                }
                const res = await createTags(reqCreateTag).unwrap();
                console.log(res);
                res.map((entry: tag_entry) => tag_ids.push(Number(entry.id)));
                try {
                    console.log(post_id);
                    const reqCreatePostTags = {
                        post_id: post_id,
                        tag_ids: tag_ids
                    }
                    const res = await createPostTags(reqCreatePostTags).unwrap();
                    console.log(res);
                    setSucmsg("Post has been successfully created");
                    setOpenSnackbar(true);
                } catch (err) {
                    setPostTagErrmsg((err as Error).message);
                    console.log(posttagerrmsg);
                }
            } catch (err) {
                setTagErrmsg((err as Error).message);
                console.log(tagerrmsg);
            }
        } catch (err) {
            setPostErrmsg((err as Error).message);
            console.log(posterrmsg);
        }

    }

    const handleBack = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        dispatch(dbApi.util.invalidateTags([{type: "PagePosts", id: pagename}]));
        navigate("/home/"+pagename, {replace: true});

    }

    const handleTagInputChange = (event: React.SyntheticEvent, newValue: string[]) => {
        setTags(newValue);
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
                    Create Post
                    </Typography>
                    <form onSubmit={handleCreatePost}>
                    <TextField
                        required
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!posterrmsg}
                        helperText={posterrmsg}
                        fullWidth
                        sx={{ marginBottom: 2 }}
                    />

                    <Autocomplete
                        multiple
                        freeSolo
                        options={tagoptions}
                        value={tags}
                        onChange={handleTagInputChange}
                        renderInput={(params) => (
                        <TextField 
                            {...params} 
                            label="Tags" 
                            placeholder="Add tags"
                            error={!!tagerrmsg} 
                            helperText={tagerrmsg} 
                            fullWidth />
                        )}
                        sx={{ marginBottom: 2 }}
                    />

                    <Box sx={{ 
                        display: "flex", 
                        flexDirection: "column"
                    }}
                    >
                        

                        <TextField
                        required
                        label="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        multiline
                        rows={4}
                        error={!!posterrmsg}
                        helperText={posterrmsg}
                        fullWidth
                        sx={{
                            marginTop: 2
                        }}
                        />

                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                        <Button variant="outlined" color="secondary" onClick={handleBack}>
                        Back
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                        Create Post
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
                    severity="success" 
                    sx={{ width: "100%" }}>
                    {sucmsg}
                </Alert>
            </Snackbar>
        </>
    )
}

export default CreatePost;