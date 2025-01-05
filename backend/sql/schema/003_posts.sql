-- +goose Up
CREATE TABLE posts (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    pagename TEXT REFERENCES pages(name) ON DELETE CASCADE,
    username TEXT NOT NULL
);


-- +goose Down
DROP TABLE posts;