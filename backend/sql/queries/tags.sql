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

-- name: GetTagsLikeNameAndByPage :many
SELECT DISTINCT tags.name 
FROM posts 
JOIN post_tags 
ON posts.id = post_tags.post_id
JOIN tags 
ON post_tags.tag_id = tags.id
WHERE pagename = $1
AND tags.name LIKE $2 || '%'
LIMIT 10;

-- name: GetTagsByPage :many
SELECT DISTINCT tags.name
FROM posts JOIN post_tags 
ON posts.id = post_tags.post_id
JOIN tags 
ON post_tags.tag_id = tags.id
WHERE pagename = $1;

-- name: GetPopularPageTags :many
SELECT tags.*, COUNT(posts.id) as tagcount
FROM tags
JOIN post_tags
ON tags.id = post_tags.tag_id
JOIN posts
ON posts.id = post_tags.post_id
WHERE posts.pagename = $1
GROUP BY tags.id
ORDER BY tagcount DESC
limit 6;