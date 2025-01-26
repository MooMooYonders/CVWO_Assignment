import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectName } from "../auth/authSlice";
import { useGetPagesQuery, useGetUserPostsByPagenameMutation, useLazyGetUserPostsAscQuery, useLazyGetUserPostsByNotificationsQuery, useLazyGetUserPostsDescQuery} from "../../api/apiSlice";
import { Box, Paper, Typography, SelectChangeEvent, ThemeProvider } from "@mui/material";
import Post from "../Pages/Post/Post";
import Filter from "../Filter/Filter";
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

type NotifPost = {
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
    unreadcomments: number
}

type Page = {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
}

const Dashboard: React.FC = () => {
    const location = useLocation();
    const username = useAppSelector(selectName);
    const [errmsg, setErrmsg] = useState("");
    const [getUserPostsAsc] = useLazyGetUserPostsAscQuery();
    const [getUserPostsDesc] = useLazyGetUserPostsDescQuery();
    const [posts, setPosts] = useState<Post[]>([]);
    const [getUserPostsByPagename] = useGetUserPostsByPagenameMutation();
    const [getUserPostsOrderedByNotifications] = useLazyGetUserPostsByNotificationsQuery();
    const {data} = useGetPagesQuery(undefined);
    const [filter, setFilter] = useState("Newest")
    const [notifposts, setNotifPosts] = useState<NotifPost[]>([]);
    const [filteroptions, setFilterOptions] = useState<string[]>([]);
    
    const handleGetUserPosts = async (filter: string) => {

        try {
            if (filter == "Oldest") {
                const res = await getUserPostsAsc(username).unwrap();
                setPosts(res);
            } else {
                const res = await getUserPostsDesc(username).unwrap();
                setPosts(res);
            }
        } catch (err) {
            setErrmsg((err as Error).message);
            console.log(errmsg);
        }
    }

    const handleGetUserPostsByPagename = async (pagename: string) => {
        try {
            const req = {
                "username": username,
                "pagename": pagename
            }
            const res = await getUserPostsByPagename(req).unwrap();
            console.log(res);
            setPosts(res);
        } catch (err) {
            setErrmsg((err as Error).message);
            console.log(errmsg);
        }
    }

    const handleGetUserPostsOrderByNotifications = async () => {
        try {
            const res = await getUserPostsOrderedByNotifications(username).unwrap();
            console.log(res);
            setNotifPosts(res);
        } catch (err) {
            setErrmsg((err as Error).message);
            console.log(errmsg);
        }
    }

    useEffect(() => {
        console.log(data);

        if (data.length == 0) {
            setFilterOptions(["Newest", "Oldest"]);
        } else {
            const pagenames = data.map((page: Page) => page.name);
            setFilterOptions(["Newest", "Oldest", ...pagenames])
        }
        setFilter("Newest");
        handleGetUserPosts("Newest");
        handleGetUserPostsOrderByNotifications();
    }, [location])

    useEffect(() => {
        if (filter == "Oldest" || filter == "Newest") {
            handleGetUserPosts(filter);
        } else {
            handleGetUserPostsByPagename(filter);
        }
    }, [filter])

    const handleChangeFilter = (event: SelectChangeEvent<string>) => {
        setFilter(event.target.value as string);
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100%",
        }}>
            <Box sx={{
                marginTop: 4,
                width: "80%",
                
            }}>
                <Typography 
                    variant="h4" 
                    sx={{
                    padding: 2,
                    color: "black"
                    }}
                >
                    Latest
                </Typography>
                {/*posts in order based on desc last_seen_at*/}
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "80%",
                    
                }}>
                    {notifposts.length == 0 
                        ? (<Paper sx={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 2,
                            minHeight: "250px"
                            }}>
                                <Typography  
                                    variant="h6"
                                    sx={{
                                        color: "black"
                                    }}
                                >
                                    No new notifications ;_;
                                </Typography>
                            </Paper>) 
                        : (<Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                width: "100%",
                                height: "100%",
                                gap: 2
                            }}>
                                {notifposts.map((post: Post)=> 
                                (<Paper sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%"
                                }}>
                                    <Post 
                                        key={post.id}
                                        username={post.username}
                                        title={post.title}
                                        post_id={post.id}
                                        content={post.content}
                                        time={post.created_at}
                                        findcomments={true}
                                    />
                                </Paper>
                                ))}
                            </Box>)
                    }
                    </Box>
            </Box>
        
            <Box sx={{
                    display: "flex",
                    width: "80%",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 6,
                }}>
                    <Paper variant="outlined"
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
                    }}>

                        <Filter value={filter} handleChange={handleChangeFilter} options={filteroptions}/>
                        
                        
                    </Paper>

                    {posts.length == 0 
                        ? (<Paper sx={{
                                width: "100%",
                                heigth: "100%",
                                minHeight: "400px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Typography variant="h6">
                                    No posts yet. Make your first post!
                                </Typography>
                            </Paper>) 
                        : posts.map((post: Post)=> 
                            <Post 
                                key={post.id}
                                username={post.username}
                                title={post.title}
                                post_id={post.id}
                                content={post.content}
                                time={post.created_at}
                                findcomments={true}
                            />
                        )
                    
                    }
                    
                    
            </Box>
        </Box>
        </ThemeProvider>)
}

export default Dashboard;