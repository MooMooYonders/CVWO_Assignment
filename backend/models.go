package main

import (
	"database/sql"
	"time"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
	"github.com/google/uuid"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	LastSeen  time.Time `json:"last_seen"`
	Name      string    `json:"name"`
}

type Page struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Name      string    `json:"name"`
}

type Post struct {
	ID        uuid.UUID      `json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	Title     string         `json:"title"`
	Content   string         `json:"content"`
	Pagename  sql.NullString `json:"pagename"`
	Username  string         `json:"username"`
}

type Tag struct {
	ID   int32  `json:"id"`
	Name string `json:"name"`
}

type PopularTag struct {
	ID       int32  `json:"id"`
	Name     string `json:"name"`
	Tagcount int64  `json:"tagcount"`
}

type PostTag struct {
	PostID uuid.UUID `json:"post_id"`
	TagID  int32     `json:"tag_id"`
}

type Comment struct {
	ID           int32         `json:"id"`
	PostID       uuid.NullUUID `json:"post_id"`
	CreatedAt    time.Time     `json:"created_at"`
	UpdatedAt    time.Time     `json:"updated_at"`
	Username     string        `json:"username"`
	Content      string        `json:"content"`
	ReplyTo      sql.NullInt32 `json:"reply_to"`
	UserLastSeen time.Time     `json:"user_last_seen"`
}

type PostWithTag struct {
	ID        uuid.UUID      `json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	Title     string         `json:"title"`
	Content   string         `json:"content"`
	Pagename  sql.NullString `json:"pagename"`
	Username  string         `json:"username"`
	PostID    uuid.UUID      `json:"post_id"`
	TagID     int32          `json:"tag_id"`
	TagID_2   int32          `json:"id_2"`
	TagName   string         `json:"tag_name"`
}

type OrderedPost struct {
	ID                  uuid.UUID      `json:"id"`
	CreatedAt           time.Time      `json:"created_at"`
	UpdatedAt           time.Time      `json:"updated_at"`
	Title               string         `json:"title"`
	Content             string         `json:"content"`
	Pagename            sql.NullString `json:"pagename"`
	Username            string         `json:"username"`
	UnreadCommentsCount int64          `json:"unreadcomments"`
}

func databaseUsertoUser(dbuser database.User) User {
	return User{
		ID:        dbuser.ID,
		CreatedAt: dbuser.CreatedAt,
		UpdatedAt: dbuser.UpdatedAt,
		LastSeen:  dbuser.LastSeen,
		Name:      dbuser.Name,
	}
}

func databasePagetoPage(dbpage database.Page) Page {
	return Page{
		ID:        dbpage.ID,
		CreatedAt: dbpage.CreatedAt,
		UpdatedAt: dbpage.UpdatedAt,
		Name:      dbpage.Name,
	}
}

func databasePagestoPages(dbpages []database.Page) []Page {
	new_pages := []Page{}
	for _, page := range dbpages {
		new_pages = append(new_pages, databasePagetoPage(page))
	}
	return new_pages
}

func databasePosttoPost(dbpost database.Post) Post {
	return Post{
		ID:        dbpost.ID,
		CreatedAt: dbpost.CreatedAt,
		UpdatedAt: dbpost.UpdatedAt,
		Title:     dbpost.Title,
		Content:   dbpost.Content,
		Pagename:  dbpost.Pagename,
		Username:  dbpost.Username,
	}
}

func databasePoststoPosts(dbposts []database.Post) []Post {
	new_posts := []Post{}
	for _, post := range dbposts {
		new_posts = append(new_posts, databasePosttoPost(post))
	}
	return new_posts
}

func databaseOrderedPosttoOrderedPost(dborderedpost database.GetUserPostsOrderedByNotificationsRow) OrderedPost {
	return OrderedPost{
		ID:                  dborderedpost.ID,
		CreatedAt:           dborderedpost.CreatedAt,
		UpdatedAt:           dborderedpost.UpdatedAt,
		Title:               dborderedpost.Title,
		Content:             dborderedpost.Content,
		Pagename:            dborderedpost.Pagename,
		Username:            dborderedpost.Username,
		UnreadCommentsCount: dborderedpost.UnreadCommentsCount,
	}
}

func databaseOrderedPoststoOrderedPosts(dborderedposts []database.GetUserPostsOrderedByNotificationsRow) []OrderedPost {
	orderedposts := []OrderedPost{}
	for _, orderedpost := range dborderedposts {
		orderedposts = append(orderedposts, databaseOrderedPosttoOrderedPost(orderedpost))
	}
	return orderedposts
}

func databasePopularTagtoPopularTag(dbpoptag database.GetPopularPageTagsRow) PopularTag {
	return PopularTag{
		ID:       dbpoptag.ID,
		Name:     dbpoptag.Name,
		Tagcount: dbpoptag.Tagcount,
	}
}

func databasePopularTagstoPopularTags(dbpoptags []database.GetPopularPageTagsRow) []PopularTag {
	new_tags := []PopularTag{}
	for _, tag := range dbpoptags {
		new_tags = append(new_tags, databasePopularTagtoPopularTag(tag))
	}
	return new_tags
}

func databaseTagtoTag(dbtag database.CreateTagRow) Tag {
	return Tag{
		ID:   dbtag.ID,
		Name: dbtag.Name,
	}
}

func databaseTagsToTags(dbtags []database.CreateTagRow) []Tag {
	new_tags := []Tag{}
	for _, tag := range dbtags {
		new_tags = append(new_tags, databaseTagtoTag(tag))
	}
	return new_tags
}

func databasePostTagtoPostTag(dbposttag database.PostTag) PostTag {
	return PostTag{
		PostID: dbposttag.PostID,
		TagID:  dbposttag.TagID,
	}
}

func databaseCommenttoComment(dbcomment database.Comment) Comment {
	return Comment{
		ID:           dbcomment.ID,
		PostID:       dbcomment.PostID,
		CreatedAt:    dbcomment.CreatedAt,
		UpdatedAt:    dbcomment.UpdatedAt,
		Username:     dbcomment.Username,
		Content:      dbcomment.Content,
		ReplyTo:      dbcomment.ReplyTo,
		UserLastSeen: dbcomment.UserLastSeen,
	}
}

func databaseCommentstoComments(dbcomments []database.Comment) []Comment {
	new_comments := []Comment{}
	for _, comment := range dbcomments {
		new_comments = append(new_comments, databaseCommenttoComment(comment))
	}
	return new_comments
}
