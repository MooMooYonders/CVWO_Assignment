-- name: CreatePage :one
INSERT INTO pages (id, created_at, updated_at, name) 
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: GetPages :many
SELECT * FROM pages;


-- name: GetPage :one
SELECT * FROM pages where pages.name = $1;