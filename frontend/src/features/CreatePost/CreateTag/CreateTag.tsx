import React, { useState } from "react";

type ThreadProps = {
    addTag: (tag: string) => void;
}

const CreateTag: React.FC<ThreadProps> = ({addTag}) => {
    const [tag, setTag] = useState("");

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addTag(tag);
        setTag("");
    }
    return (
        <div>
            Hello
            <form onSubmit={handleSubmit}>
                <label>
                    Enter Tag
                    <input
                        type="text"
                        value={tag}
                        onChange={e => setTag(e.target.value)}
                    />
                </label>
            </form>
            <div>{tag}</div>
        </div>
    )
}

export default CreateTag;