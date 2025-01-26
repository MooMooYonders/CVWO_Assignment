import { useState } from "react";
import { dbApi, useCreateCommentMutation, useGetPostByPostIDQuery, useUpdateCommentsUserLastSeenMutation, useUpdateLastSeenMutation } from "../../../api/apiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectName } from "../../auth/authSlice";
import { Box, Button, Paper, TextField, ThemeProvider } from "@mui/material";
import theme from "../../Theme/Theme";

type CreateCommentProps = {
    isReply: boolean;
    reply_id: number;
    handleCloseReply: () => void;
    handleSubmitComment: () => void;
}

const CreateComment: React.FC<CreateCommentProps> = ({ isReply, reply_id, handleCloseReply, handleSubmitComment }) => {
    const [createComment, {isLoading, isError}] = useCreateCommentMutation();
    const [comment, setComment] = useState("");
    const username = useAppSelector(selectName);
    const [errmsg, setErrmsg] = useState("");
    const {pagename, post_id } = useParams<{pagename: string, post_id: string, reply_id?: string}>();
    const {data} = useGetPostByPostIDQuery(post_id);
    const [updateLastSeen] = useUpdateCommentsUserLastSeenMutation();
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSubmit = async () => {
        const reply_to = isReply ? reply_id : null;

        const req = {
            "post_id": post_id,
            "username": username,
            "content": comment,
            "reply_to": reply_to,
        }
        
        try {
            const res = await createComment(req).unwrap();
            if (data.username == username) {
                try {
                    updateLastSeen(post_id)
                } catch (err) {
                    console.log((err as Error).message);
                }
            }
            setIsExpanded(false);
            if (isReply) {
                handleCloseReply();
            }
            handleSubmitComment();
        } catch (err) {
            setErrmsg("Failed to create comment");
            console.log((err as Error).message);
        }
        
    }

    const handleBack = () => {
        setIsExpanded(false);
        if (isReply) {
            handleCloseReply();
        }
    }

    const handleExpand = () => {
        setIsExpanded(true);
    }

    return (
        <ThemeProvider theme={theme}>
        <Paper
            elevation={2}
            sx={{
                padding: isExpanded ? 2 : 1,
                width: "97%",
                borderRadius: "8px",
                border: "1px solid #787c7e",
                marginTop: 2,
                backgroundColor: "white", 
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
            >
            {isExpanded ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Comment here"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "white", 
                        "&:hover": {
                        backgroundColor: "white", 
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: "black", 
                    },
                    }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button 
                        variant="text" 
                        onClick={handleBack} 
                        sx={{
                            color: theme.palette.primary.main,
                            textTransform: "none",
                            fontWeight: "bold",
                          }}
                        >
                    Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!comment.trim()}
                        sx={{
                            backgroundColor: theme.palette.primary.light,
                            color: "#fff",
                            fontWeight: "bold",
                            textTransform: "none",
                            "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                    Submit
                    </Button>
                </Box>
                </Box>
            ) : (
                <TextField
                placeholder="Add a comment..."
                fullWidth
                variant="outlined"
                onFocus={handleExpand}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "white", 
                        color: "black",
                        "&:hover": {
                        backgroundColor: "white", 
                        },
                    },
                    "& .MuiInputBase-input": {
                        color: "black", 
                    },
                    
                }}
                />
            )}
            </Paper>

        </ThemeProvider>
        
    )

}

export default CreateComment;