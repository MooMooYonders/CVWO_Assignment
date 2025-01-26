import { Chip } from "@mui/material";

type CreatePostProps = {
    tag: string
}
const Tag: React.FC<CreatePostProps>= ({tag}) => {
    
    return (
        <Chip
            label={tag}
            color="primary"  
            sx={{
                backgroundColor: "#e0e0e0", 
                color: "#424242", 
                fontWeight: 500,
                "&:hover": {
                backgroundColor: "#d6d6d6", 
                },
                padding: '6px 10px',  
                boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',  
            }}
        />
    )
}

export default Tag;