import React from "react"

type ThreadProps = {
    username: string;
    title: string;
    content: string;
}
const Thread: React.FC<ThreadProps> = ({username, title, content}) => {
    
    return (
    <div>
        <div>{username}</div>
        <div>{title}</div>
        <div>{content}</div>
    </div>)
}

export default Thread;