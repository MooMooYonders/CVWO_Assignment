-- name: CreatePost :one
INSERT INTO posts (id, created_at, updated_at, title, content, pagename, username) 
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- name: GetUserPostsAsc :many
SELECT * FROM posts where posts.username = $1
ORDER BY posts.created_at ASC;

-- name: GetUserPostsDesc :many
SELECT * FROM posts where posts.username = $1
ORDER BY posts.created_at DESC;

-- name: GetUserPostsByPagename :many
SELECT * FROM posts WHERE posts.username = $1
AND pagename = $2
ORDER BY posts.created_at ASC;



-- name: GetUserPostsOrderedByNotifications :many
SELECT posts.*, COUNT(comments.id) as unread_comments_count
FROM posts
JOIN comments 
ON posts.id = comments.post_id
WHERE posts.username = $1
AND comments.created_at > comments.user_last_seen
GROUP BY posts.id
ORDER BY unread_comments_count DESC
LIMIT 3;

-- name: GetPagePostsAsc :many
SELECT * FROM posts where posts.pagename = $1
ORDER BY posts.created_at ASC;

-- name: GetPagePostsDesc :many
SELECT * FROM posts where posts.pagename = $1
ORDER BY posts.created_at DESC;

-- name: GetPostByPostID :one
SELECT * FROM posts where posts.id = $1;


-- name: GetPostsLikeTitleAsc :many
SELECT * FROM posts
WHERE posts.pagename = $1
AND posts.title LIKE $2 || '%'
ORDER BY posts.created_at ASC
LIMIT 10;


-- name: GetPostsLikeTitleDesc :many
SELECT * FROM posts
WHERE posts.pagename = $1
AND posts.title LIKE $2 || '%'
ORDER BY posts.created_at DESC
LIMIT 10;


-- name: GetPostsByTagsAsc :many
SELECT * FROM posts 
WHERE posts.id IN (
    SELECT posts.id 
    FROM posts 
    JOIN post_tags 
    ON posts.id = post_tags.post_id
    JOIN tags 
    ON post_tags.tag_id = tags.id
    WHERE posts.pagename = $1
    AND tags.name = ANY($2::text[])
    GROUP BY posts.id
    HAVING COUNT(DISTINCT tags.name) = array_length($2, 1)
)
ORDER BY posts.created_at ASC
LIMIT 10;


-- name: GetPostsByTagsDesc :many
SELECT * FROM posts 
WHERE posts.id IN (
    SELECT posts.id 
    FROM posts 
    JOIN post_tags 
    ON posts.id = post_tags.post_id
    JOIN tags 
    ON post_tags.tag_id = tags.id
    WHERE posts.pagename = $1
    AND tags.name = ANY($2::text[])
    GROUP BY posts.id
    HAVING COUNT(DISTINCT tags.name) = array_length($2, 1)
)
ORDER BY posts.created_at DESC
LIMIT 10;
