-- name: CreatePost :one
INSERT INTO posts (id, created_at, updated_at, title, content, pagename, username) 
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetUserPosts :many
SELECT * FROM posts where posts.username = $1;

-- name: GetPagePosts :many
SELECT * FROM posts where posts.pagename = $1;
