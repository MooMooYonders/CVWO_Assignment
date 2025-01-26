-- name: CreateComment :one
INSERT INTO comments (post_id, created_at, updated_at, username, content, reply_to, user_last_seen)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetCommentsByPostID :many
SELECT * FROM comments 
WHERE comments.post_id = $1
ORDER BY comments.created_at ASC;

-- name: GetCommentByID :one
SELECT * FROM comments where comments.id = $1;

-- name: GetUnreadCommentsByPostID1 :many
SELECT comments.* 
FROM comments 
JOIN posts 
ON comments.post_id = posts.id 
JOIN users 
ON posts.username = users.name 
WHERE comments.post_id = $1 
AND comments.updated_at > users.last_seen
ORDER BY comments.created_at ASC;


-- name: GetUnreadCommentsByPostID :many
SELECT * FROM comments 
WHERE comments.post_id = $1
AND comments.created_at > comments.user_last_seen
ORDER BY comments.created_at ASC;

-- name: GetReadCommentsByPostID :many
SELECT * FROM comments 
WHERE comments.post_id = $1
AND comments.created_at <= comments.user_last_seen
ORDER BY comments.created_at ASC;

-- name: UpdateCommentsUserLastSeen :exec
UPDATE comments
SET user_last_seen = $1
WHERE comments.post_id = $2;
