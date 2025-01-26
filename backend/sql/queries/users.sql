-- name: CreateUser :one
INSERT INTO users (id, created_at, updated_at, last_seen, name) 
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUser :one
SELECT users.name FROM users where users.name = $1;

-- name: GetLastSeen :one
SELECT users.last_seen 
FROM users 
WHERE users.name = $1;

-- name: UpdateLastSeen :exec
UPDATE users
SET last_seen = $1
WHERE name = $2;
