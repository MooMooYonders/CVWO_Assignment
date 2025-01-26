-- +goose Up
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    username TEXT NOT NULL REFERENCES users(name) ON DELETE CASCADE,
    content TEXT NOT NULL,
    reply_to INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    user_last_seen TIMESTAMP NOT NULL
);


-- +goose Down
DROP TABLE comments;