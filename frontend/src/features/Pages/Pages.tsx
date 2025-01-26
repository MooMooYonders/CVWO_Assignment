import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetPostsByTagsAscMutation, useGetPostsByTagsDescMutation, useLazyGetPagePostsAscQuery, useLazyGetPagePostsDescQuery, useLazyGetPopularTagsByPageQuery, useLazyGetPostsLikeTitleAscQuery, useLazyGetPostsLikeTitleDescQuery, useLazyGetTagsByPageQuery} from "../../api/apiSlice";
import { TextField, Button, Autocomplete, ToggleButtonGroup, ToggleButton, Box, Typography, Paper, SelectChangeEvent, ThemeProvider } from "@mui/material";
import Post from "./Post/Post";
import Filter from "../Filter/Filter";
import Tag from "../Tag/Tag";
import theme from "../Theme/Theme";

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

type PopTag = {
    id: number
    name: string
    tagcount: number
}


const Pages: React.FC = () => {
    const [getPostsLikeTitleAsc] = useLazyGetPostsLikeTitleAscQuery();
    const [getPostsLikeTitleDesc] = useLazyGetPostsLikeTitleDescQuery();
    const [getPagePostsAsc] = useLazyGetPagePostsAscQuery();
    const [getPagePostsDesc] = useLazyGetPagePostsDescQuery();
    const [getPostsByTagsAsc] = useGetPostsByTagsAscMutation();
    const [getPostsByTagsDesc] = useGetPostsByTagsDescMutation();
    const {pagename} = useParams<{pagename: string}>();
    const navigate = useNavigate();
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    const [searchybytagortitle, setsearchbytagortitle] = useState("tag");
    const [errmsg, setErrmsg] = useState("");
    const [titleoptions, setTitleOptions] = useState<Post[]>([]);
    const [tagoptions, setTagOptions] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const location = useLocation();
    const [getTagsByPage] = useLazyGetTagsByPageQuery();
    const [filter, setFilter] = useState("Newest");
    const [options, setOptions] = useState<string[]>(["Newest", "Oldest"]);
    const [getPopularTagsByPage] = useLazyGetPopularTagsByPageQuery();
    const [poptags, setPopTags] = useState<string[]>([])

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value as string);
    }

    const handleNavTag = (poptag: string) => {
        setsearchbytagortitle("tag");
        setTags([...tags, poptag]);
    }

    const handlegetpoptags = async () => {
        try {
            const res = await getPopularTagsByPage(pagename).unwrap();
            setPopTags(res.map((poptag: PopTag) => poptag.name));
            console.log(poptags);
        } catch (err) {
            setErrmsg((err as Error).message);
            console.log(errmsg);
        }
    } 
    
    const handlegetpageposts = async (order: string) => {
        try {
            let res;
            if (order == "Newest") {
                res = await getPagePostsDesc(pagename).unwrap();
            } else {
                res = await getPagePostsAsc(pagename).unwrap();
            }
            setPosts(res);
            setTitleOptions(res.length <= 0 ? []:res.map((post: Post) => post.title));
        } catch (err) {
            console.log((err as Error).message);
        }
        
    }

    const searchByTitle = async (search: string, order: string) => {
        try {
            const req = {
                "pagename": pagename,
                "title": search
            }
            let res; 
            if (order == "Newest") {
                res = await getPostsLikeTitleDesc(req).unwrap();
            } else {
                res = await getPostsLikeTitleAsc(req).unwrap();
            }
            console.log(res);
            setPosts(res);
        } catch (err) {
            console.log(err);        
        }
    }

    const searchByTag = async (order: string) => {
        try {
            const req = {
                "pagename": pagename,
                "tags": tags
            }
            let res;
            if (order == "Newest") {
                res = await getPostsByTagsDesc(req).unwrap();
            } else {
                res = await getPostsByTagsAsc(req).unwrap();
            }
            console.log(res);
            setPosts(res);
            setSearch("");
        } catch (err) {
            setErrmsg((err as Error).message);
            console.log(errmsg);
        }
    }
    
    useEffect(() => {
        setSearch("");
        handlegetpageposts("Newest");  
        handlegetpoptags();
        
    }, [pagename])

   useEffect(() => {
        if (search === "" && tags.length <= 0) {
            try {
                setSearch("");
                handlegetpageposts(filter);
            } catch (err) {
                console.log((err as Error).message);
            }
        }

   }, [search])

   useEffect(() => {
        if (tags.length <= 0) {
            try {
                setSearch("");
                handlegetpageposts(filter);
            } catch (err) {
                console.log((err as Error).message);
            }
        } else {
            searchByTag(filter);
        }
   }, [tags])

   useEffect(() => {
        setSearch("");
        setTags([]);
        getTags();
        setFilter("Newest");
        handlegetpageposts("Newest");
   }, [searchybytagortitle, location])

   useEffect(() => {
        if (search == "" && tags.length <= 0) {
            handlegetpageposts(filter);
        } else if (tags.length > 0 ) {
            searchByTag(filter);
        } else {
            searchByTitle(search, filter);
        }
   }, [filter])

   const getTags = async () => {
        try {
            const tags = await getTagsByPage(pagename).unwrap();
            setTagOptions(tags == null ? [] : tags); 
        } catch (err) {
            console.log((err as Error).message);
        }
   }


    const navCreate = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();
        handleTagChange();
        navigate("/home/" + pagename + "/createpost");
    }

    const handleTagChange = () => {
        setsearchbytagortitle("tag");
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchybytagortitle == "tag") {
            searchByTag(filter);
        } else {
            searchByTitle(search, filter);
        }
    }

    const handleTagInputChange = (event: React.SyntheticEvent, newValue: string[]) => {
        setTags(newValue);
    } 

    const handleTitleInputChange = (event: React.SyntheticEvent, newValue: string) => {
        setSearch(newValue);
    }

    const handleToggleChange = (event: React.MouseEvent<HTMLElement>, value: string) => {
        setsearchbytagortitle(value);
    }


    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                minHeight: "100%",
                justifyContent: "center",
                backgroundColor: theme.palette.background.default,
                color: "white", 
                }}
            >
                <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    padding: 2,
                    justifyContent: "center",
                    width: "85%",
                    marginTop: 5,
                }}
                >
                <Typography
                    sx={{
                    color: "black", 
                    marginBottom: 1.3,
                    fontSize: theme.typography.h1.fontSize,
                    }}
                >
                    Find Posts
                </Typography>

                <Typography
                    sx={{
                    marginBottom: 3,
                    color: "gray", 
                    fontSize: theme.typography.h4.fontSize,
                    }}
                >
                    You May Choose to Search By Title Or Tag
                </Typography>

                <Box
                    sx={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                    }}
                >
                    {searchybytagortitle === "title" ? (
                    <form
                        onSubmit={handleSubmit}
                        style={{
                        width: "100%",
                        height: "100%",
                        }}
                    >
                        <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            onInputChange={handleTitleInputChange}
                            options={titleoptions}
                            getOptionLabel={(option) => {
                                if (typeof option === "string") {
                                    return option;
                                }
                                return option.title;
                            }}
                            renderInput={(params) => (
                                <TextField
                                {...params}
                                label="Title"
                                />
                            )}
                            sx={{
                                marginBottom: 2,  
                                borderRadius: "4px",
                            }}
                            />
                        <button type="submit" style={{ display: "none" }}>Search</button>

                    </form>
                    ) : (
                    <div
                        style={{
                        width: "100%",
                        height: "100%",
                        }}
                    >
                        <Autocomplete
                        multiple
                        id="tags-standard"
                        options={tagoptions}
                        value={tags}
                        onChange={handleTagInputChange}
                        getOptionLabel={(option) => option}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Tags"
                            placeholder="Tags"
                            />
                        )}
                        sx={{
                            marginBottom: 2,
                            borderRadius: "4px",
                        }}
                        />
                    </div>
                    )}
                </Box>

                <ToggleButtonGroup
                    color="primary"
                    value={searchybytagortitle}
                    exclusive
                    onChange={handleToggleChange}
                    aria-label="Platform"
                    sx={{
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    width: "100%",
                    gap: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ color: "black" }}>
                    Search By:
                    </Typography>
                    <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        width: "17%",
                    }}
                    >
                    <ToggleButton
                        sx={{
                        width: "50%",
                        color: "white",
                        backgroundColor: "#444",
                        "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                        },
                        padding: 1,
                        borderRadius: "5px 0 0 5px",
                        }}
                        value="tag"
                    >
                        Tag
                    </ToggleButton>
                    <ToggleButton
                        sx={{
                        width: "50%",
                        color: "white",
                        backgroundColor: "#444",
                        borderRadius: "5px 0 0 5px",
                        "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.main,
                            color: "white",
                        },
                        padding: 1
                        }}
                        value="title"
                    >
                        Title
                    </ToggleButton>
                    </Box>
                </ToggleButtonGroup>
                </Box>

                <Box
                sx={{
                    display: "flex",
                    width: "85%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 3.5,
                    flexWrap: "wrap",
                }}
                >
                <Box
                    sx={{
                    display: "flex",
                    width: "65%",
                    flexDirection: "column",
                    alignItems: "center",
                    }}
                >
                    <Paper
                    variant="outlined"
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                        borderRadius: 0,
                        borderTopLeftRadius: 6,
                        borderTopRightRadius: 6,
                        border: "0.5px solid #B0B0B0",
                        backgroundColor: theme.palette.primary.main,
                    }}
                    >
                    <Filter value={filter} options={options} handleChange={handleFilterChange} />
                    <Button
                        variant="contained"
                        onClick={navCreate}
                        sx={{
                        padding: "8px 16px",
                        margin: 1,
                        marginRight: 1.4,
                        backgroundColor: "#2899b3"
                        }}
                    >
                        Create Post
                    </Button>
                    </Paper>

                    {posts.length === 0 ? (
                    <Paper
                        sx={{
                        width: "100%",
                        height: "100%",
                        minHeight: "400px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "white",
                        }}
                    >
                        <Typography variant="h6" sx={{ color: "black" }}>
                        Could not find any posts
                        </Typography>
                    </Paper>
                    ) : (
                    posts.map((post: Post) => (
                        <Post
                        key={post.id}
                        username={post.username}
                        title={post.title}
                        post_id={post.id}
                        content={post.content}
                        time={post.created_at}
                        findcomments={false}
                        />
                    ))
                    )}
                </Box>

                <Box
                    sx={{
                    display: "flex",
                    width: "30%",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: 4,
                    height: "100%",
                    }}
                >
                    <Paper
                    sx={{
                        display: "flex",
                        width: "100%",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 1,
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                    }}
                    >
                    <Typography variant="h5" sx={{ padding: 2, fontWeight: "bold" }}>
                        Popular Tags
                    </Typography>
                    <Box
                        sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        flexWrap: "wrap",
                        marginBottom: 3
                        }}
                    >
                        {poptags.map((poptag: string, index: number) => (
                        <div key={index} onClick={() => handleNavTag(poptag)}>
                            <Tag tag={poptag} />
                        </div>
                        ))}
                    </Box>
                    </Paper>

                    
                </Box>
                </Box>
            </Box>
            </ThemeProvider>
)
}

export default Pages;