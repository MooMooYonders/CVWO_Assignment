-- name: CreateTag :one
WITH ins AS (
    INSERT INTO tags (name)
    VALUES ($1)
    ON CONFLICT (name) DO NOTHING
    RETURNING id, name
)
SELECT id, name FROM ins
UNION ALL 
SELECT id, name FROM tags WHERE name = $1;

-- name: GetTagsByName :many
SELECT * FROM tags where tags.name = $1;

-- name: GetTagsById :many
SELECT * FROM tags where tags.id = $1;