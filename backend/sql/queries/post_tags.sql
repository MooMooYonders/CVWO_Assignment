-- name: CreatePostTag :one
INSERT INTO post_tags (post_id, tag_id) 
VALUES ($1, $2)
RETURNING *;