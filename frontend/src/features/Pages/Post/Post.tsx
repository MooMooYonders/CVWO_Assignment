import React, { useEffect, useState } from "react"
import { useGetTagsByPostIdQuery, useLazyGetTagsByPostIdQuery, useLazyGetUnreadCommentsByPostIDQuery, useUpdateCommentsUserLastSeenMutation, useUpdateLastSeenMutation } from "../../../api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Box, Chip, IconButton, Paper, ThemeProvider, Typography } from "@mui/material";
import Tag from "../../Tag/Tag";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import theme from "../../Theme/Theme";
import { Palette } from "@mui/icons-material";
import { timeBefore } from "../../../Functions/Functions";

type PostProps = {
    username: string;
    title: string;
    content: string;
    post_id: string;
    findcomments: boolean;
    time: string;
}


const Post: React.FC<PostProps> = ({username, title, content, post_id, findcomments, time}) => {
    const [getTagsById] = useLazyGetTagsByPostIdQuery()
    const navigate = useNavigate();
    const {pagename} = useParams<{pagename: string}>();
    const [tags, setTags] = useState<string[]>([]);
    const [getUnreadCommentsByPostID] = useLazyGetUnreadCommentsByPostIDQuery();
    const [unreadlen, setUnreadLen] = useState(0);
    

    useEffect(() => {
        setUnreadLen(0);
        const gettags = async () => {
            try {
                const res = await getTagsById(post_id).unwrap();
                setTags(res);
            } catch (err) {
                console.log((err as Error).message);
            }
        }

        const getunreadcomments = async () => {
            try {
                const res = await getUnreadCommentsByPostID(post_id).unwrap();
                setUnreadLen(res.length <= 0? 0 : res.length);
                
            } catch (err) {
                console.log((err as Error).message);
            }
        }

        gettags();

        if (findcomments) {
            getunreadcomments();
        }
    }, [])
    
    
    const handleNavPostPage = () => {

        navigate("/home/" + pagename + "/" + post_id, { state: { message: 'from_dashboard'}});
    }

    return (
        <ThemeProvider theme={theme}>
        <Badge
                badgeContent={unreadlen}
                color="error"
                max={99}
                sx={{      
                    width: "100%",
                    ".MuiBadge-dot": {
                    width: 40,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "red"
                    },
                }}
            >
            <Paper 
                variant="outlined" 
                onClick={handleNavPostPage}
                sx={{
                    gap: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    borderRadius: 0,
                    border: "0.4px solid #62696b",
                    backgroundColor: "white",
                    color: theme.palette.text.primary,
                    width: "100%",
                    height: "100%"
                    }}
            >
                
                <Box 
                    sx={{
                        gap: 1,
                        display: "flex",
                        flexDirection: "column",
                        width: "95%",
                        margin: 2
                    }}
                >
                    <Box 
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 1
                    }}>
                        <Typography variant="body2" sx={{ color: "#62696b" }}>
                            <span style={{ color: "#1e8fb2" }}>{username}</span> · {timeBefore(time)}
                        </Typography>

                        <Box sx={{
                            display: "flex",
                            gap: 0.4,
                            flexDirection: "row",
                            marginTop: 1
                        }}>
                            {tags.map((tag: string, index: number) => 
                                (<Tag key={index} tag={tag}/>)
                            )}
                        </Box>
                        
                    </Box>
                    <Typography variant="h4" sx={{ color: "#212121" }}>{title}</Typography>
                    <Typography variant="body1" sx={{ color: "#424242", marginTop: 0.6}}>{content}</Typography>
                    
                    
                    
                </Box>
            </Paper>
        </Badge>
        </ThemeProvider>
    )
}

export default Post;