import React, { useEffect, useState } from "react";
import { useLazyGetCommentByIDQuery } from "../../../api/apiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Paper, ThemeProvider, Typography } from "@mui/material";
import CreateComment from "../CreateComment/CreateComment";
import theme from "../../Theme/Theme";
import { timeBefore } from "../../../Functions/Functions";

type nullint32 = {
    "Int32": number;
    "Valid": boolean;
}

type CommentProps = {
    id: number;
    created_at: string;
    updated_at: string;
    username: string;
    content: string;
    reply_to: nullint32;
    last_seen_at: string;
    handleSubmitComment: () => void;
}



const Comment: React.FC<CommentProps> = ({id, created_at, updated_at, username, content, reply_to, handleSubmitComment}) => {
    const [getComment, {data, isLoading, isError}] = useLazyGetCommentByIDQuery();
    const [openReply, setopenReply] = useState(false);
    
    useEffect(() => {
        if (reply_to.Valid) {
            getComment(reply_to.Int32.toString());
        }
    }, [reply_to, getComment])

    const handleOpenReply = () => {
        setopenReply(true);
    }

    const handleCloseReply = () => {
      console.log('hi');
        setopenReply(false);
    }

    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ 
          marginBottom: 3,
          width: "100%",  
        }}>
          <Paper sx={{ 
            padding: 2, 
            borderRadius: 2, 
            backgroundColor: "#ffffff",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)"
          }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1 
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between' 
              }}>
                <Typography 
                  variant="body2" 
                  fontWeight="bold"
                  sx={{
                    color: "#1e8fb2"
                  }}>{username}</Typography>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: theme.palette.text.secondary
                  }}
                >{timeBefore(created_at)}</Typography>
              </Box>

              {reply_to.Valid && data && (
                <Box sx={{ 
                  marginTop: 1, 
                  padding: 1, 
                  backgroundColor: "#d0f0fd", 
                  boxShadow: "0px 1px 5px rgba(0, 0, 0, 0.1)",
                  borderRadius: 2 }}>

                  <Typography variant="body2"
                    sx={{ fontWeight: "bold", color: "#1976d2" }}
                  >
                    Replying to: 
                  </Typography>

                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#37aecf", 
                      marginTop: 0.4
                    }}
                  >
                    {data.username}
                  </Typography>

                  <Typography 
                    variant="body2"
                    sx={{
                      marginTop: 1.5
                    }}
                  >
                    {data.content}
                  </Typography>
                </Box>
              )}
              
              <Typography 
                variant="body1" 
                sx={{ 
                  marginTop: 1.2,
              }}>
                {content}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                marginTop: 1 
              }}>
                <Button 
                  variant="contained" 
                  size="small" 
                  color="primary" 
                  onClick={handleOpenReply}
                  sx={{
                    borderRadius: "16px",
                    padding: "6px 16px",
                    fontWeight: "bold",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", 
                  }}
                >
                  Reply
                </Button>
              </Box>

            </Box>

          </Paper>
          {isLoading && <Typography variant="body2">Loading reply...</Typography>}
          {isError && <Typography variant="body2" color="error">Error loading reply.</Typography>}
          {openReply 
            ? <CreateComment isReply={true} reply_id={id} handleCloseReply={handleCloseReply} handleSubmitComment={handleSubmitComment}/>
            : null}
    </Box>
    </ThemeProvider>
    )
}

export default Comment;