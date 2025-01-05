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

type PostTag struct {
	PostID uuid.UUID `json:"post_id"`
	TagID  int32     `json:"tag_id"`
}

func databaseUsertoUser(dbuser database.User) User {
	return User{
		ID:        dbuser.ID,
		CreatedAt: dbuser.CreatedAt,
		UpdatedAt: dbuser.UpdatedAt,
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
