import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetCommentByIDQuery, useGetCommentsByPostIDQuery, useGetPostByPostIDQuery, useGetTagsByPostIdQuery, useLazyGetCommentsByPostIDQuery, useLazyGetReadCommentsByPostIDQuery, useLazyGetUnreadCommentsByPostIDQuery, useUpdateCommentsUserLastSeenMutation } from "../../api/apiSlice";
import Comment from "./Comment/Comment";
import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Chip, IconButton, ThemeProvider } from "@mui/material";
import Tag from "../Tag/Tag";
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreateComment from "./CreateComment/CreateComment";
import theme from "../Theme/Theme";
import { timeBefore } from "../../Functions/Functions";

type nullint32 = {
    "Int32": number;
    "Valid": boolean;
}

type Commentjson = {
    id: number;
    post_id: string;
    created_at: string;
    updated_at: string;
    username: string;
    content: string;
    reply_to: nullint32
    last_seen_at: string
}

const PostPage: React.FC = () => {
    const {post_id} = useParams<{post_id: string}>();
    const {pagename} = useParams<{pagename: string}>();
    const {data: postData, isLoading: postLoading, isError: postError} = useGetPostByPostIDQuery(post_id);
    const {data: tagData, isLoading: tagLoading, isError: tagError} = useGetTagsByPostIdQuery(post_id);
    const navigate = useNavigate();
    const [UpdateCommentsUserLastSeen] = useUpdateCommentsUserLastSeenMutation();
    const [comments, setComments] = useState<Commentjson[]>([]);
    const [unreadcomments, setUnreadComments] = useState<Commentjson[]>([]);
    const [readcomments, setReadComments] = useState<Commentjson[]>([]);
    const [getComments] = useLazyGetCommentsByPostIDQuery();
    const [getUnreadComments] = useLazyGetUnreadCommentsByPostIDQuery();
    const [getReadComments] = useLazyGetReadCommentsByPostIDQuery();
    const [isdashboard, setIsDashboard] = useState<boolean>(false);
    const location = useLocation();
    

    const handleGetComments = async () => {
        try {
            const res = await getComments(post_id).unwrap();
            setComments(res);
            console.log(res);
        } catch (err) {
            console.log((err as Error).message);
        }
    } 

    const handleGetUnreadComments = async () => {
        try {
            const res = await getUnreadComments(post_id).unwrap();
            setUnreadComments(res);
        } catch (err) {
            console.log((err as Error).message);
        }
    }

    const handleGetReadComments = async () => {
        try {
            const res = await getReadComments(post_id).unwrap();
            setReadComments(res);
        } catch (err) {
            console.log((err as Error).message);
        }
    }

    useEffect(() => {
        const is_dashboard = pagename == "undefined" ? true : false;
        setIsDashboard(is_dashboard);
        console.log("hi");
        
        handleGetUnreadComments();
        if (is_dashboard && unreadcomments.length > 0) {
            handleGetReadComments();
            setComments([]);
        } else {
            setUnreadComments([]);
            setReadComments([]);
            handleGetComments();
        }

    }, [location])

    const handleSubmitComment = () => {
        setUnreadComments([]);
        setReadComments([]);
        handleGetComments();
    }


    const handleBack = () => {
        if (isdashboard) {
            const handleUpdateCommentsUserLastSeen = async () => {
                try {
                    const res = await UpdateCommentsUserLastSeen(post_id).unwrap();
                    console.log("success!")
                } catch (err) {
                    console.log((err as Error).message);
                }
            }
            handleUpdateCommentsUserLastSeen();
            navigate("/home/dashboard");
            return;
        }
        
        navigate("/home/" + pagename);
    }

    if (postLoading) {
        return <Typography>Loading post...</Typography>;
    }

    if (postError || !postData) {
        return <Typography>Error loading post data.</Typography>;
    }

    if (tagLoading) {
        return <Typography>Loading post...</Typography>;
    }

    if (tagError || !tagData) {
        return <Typography>Error loading post data.</Typography>;
    }

    return (
        <ThemeProvider theme={theme}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            backgroundColor: theme.palette.background.default,
            gap: 2,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Paper
                variant="outlined"
                sx={{
                backgroundColor: "white",
                marginTop: "2%",
                width: "85%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: 3
            }}>
                <Box
                    sx={{
                        marginTop: 2,
                        width: "97%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                }}>
                    <Box sx={{
                        width: "5%",
                        height: "5%",
                        marginTop: -3,
                        marginBottom: 1
                    }}>
                        <IconButton
                            color="primary"
                            onClick={handleBack}
                            sx={{ 
                                backgroundColor: '#cfd9dc', 
                                '&:hover': {
                                backgroundColor: '#a3a6a7', 
                                },
                                padding: 1,
                                borderRadius: '50%',
                            }}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                    </Box>

                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                            <span style={{ color: "#1e8fb2" }}>{postData.username}</span> · {timeBefore(postData.created_at)}
                    </Typography>

                    <Typography variant="h3" sx={{ color: "#212121", marginTop: 1 }}>{postData.title}</Typography>
                    <Typography variant="body1" sx={{ color: "#424242", marginTop: 0.6}}>{postData.content}</Typography>

                    <Box sx={{
                            display: "flex",
                            gap: 1,
                            flexDirection: "row",
                            marginTop: 1.6
                        }}>
                        {tagData.map((tag: string, index: number) => {
                            return (<Tag key={index} tag={tag}/>)
                        })}
                    </Box>
                </Box>

                <Divider variant="middle" 
                    sx={{ 
                        width: "97%", 
                        marginBottom: 0.8,
                        marginTop: 2, 
                        color:"black",
                        borderColor: "#BDBDBD"
                    }} 
                />

                <CreateComment isReply={false} reply_id={0} handleCloseReply={() => {1;}} handleSubmitComment={handleSubmitComment}/>

                <Box sx={{
                    display: "flex",
                    gap: 0,
                    flexDirection: "column",
                    width: "97%",
                    marginTop: 2
                }}>
                    {comments.map((comment: Commentjson, index: number) => 
                    (<Comment 
                        key={index} 
                        id = {comment.id}
                        created_at = {comment.created_at}
                        updated_at = {comment.updated_at}
                        username = {comment.username}
                        content = {comment.content}
                        reply_to = {comment.reply_to}
                        last_seen_at={comment.last_seen_at}
                        handleSubmitComment={handleSubmitComment}
                    />)
                    )}
                    {readcomments.map((comment: Commentjson, index: number) => 
                        (
                        <Comment 
                            key={index} 
                            id = {comment.id}
                            created_at = {comment.created_at}
                            updated_at = {comment.updated_at}
                            username = {comment.username}
                            content = {comment.content}
                            reply_to = {comment.reply_to}
                            last_seen_at={comment.last_seen_at}
                            handleSubmitComment={handleSubmitComment}
                        />)
                        )}
                    {isdashboard && unreadcomments.length > 0 
                        ? (<Box>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                width: "100%",
                                marginBottom: 3.4,
                                marginTop: 1.4, 
                                justifyContent: "space-around"
                            }}>
                                <Divider 
                                    variant="middle"
                                    sx={{ 
                                        width: "36%", 
                                        borderColor: "black"}} 
                                />
                                <Typography variant="body1">Unread Messages</Typography>
                                <Divider 
                                    variant="middle"
                                    sx={{ 
                                        width: "36%", 
                                        borderColor: "black"}} 
                                />
                             </Box>
                            </Box>
                            ) 
                        : null }
                    {unreadcomments.map((comment: Commentjson, index: number) => 
                        (
                        <Comment 
                            key={index} 
                            id = {comment.id}
                            created_at = {comment.created_at}
                            updated_at = {comment.updated_at}
                            username = {comment.username}
                            content = {comment.content}
                            reply_to = {comment.reply_to}
                            last_seen_at={comment.last_seen_at}
                            handleSubmitComment={handleSubmitComment}
                        />)
                    )}
                    
                </Box>

                
                
                
            </Paper>
            
        </Box>
        </ThemeProvider>     
    )

}

export default PostPage;