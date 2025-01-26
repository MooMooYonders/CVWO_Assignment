-- name: CreatePostTag :one
INSERT INTO post_tags (post_id, tag_id) 
VALUES ($1, $2)
RETURNING *;

-- name: GetPostTagsByPostID :many
SELECT tags.name FROM 
post_tags JOIN tags on post_tags.tag_id = tags.id 
WHERE post_tags.post_id = $1;
