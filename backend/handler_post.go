package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func stringtonullstring(s string) sql.NullString {
	if s == "" {
		return sql.NullString{String: "", Valid: false}
	}
	return sql.NullString{String: s, Valid: true}
}

func (apiCfg apiConfig) handleGetPagePosts(w http.ResponseWriter, r *http.Request) {
	pagename := chi.URLParam(r, "pagename")

	pageposts, err := apiCfg.DB.GetPagePosts(r.Context(), stringtonullstring(pagename))
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error getting page posts %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(pageposts))
}

func (apiCfg apiConfig) handleCreatePost(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		Pagename string `json:"pagename"`
		Username string `json:"username"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON %v", err))
		return
	}

	post, err := apiCfg.DB.CreatePost(r.Context(), database.CreatePostParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Title:     params.Title,
		Content:   params.Content,
		Pagename:  stringtonullstring(params.Pagename),
		Username:  params.Username,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to create post %v", err))
	}

	respondWithJSON(w, 200, databasePosttoPost(post))

}

func (apiCfg apiConfig) handleGetUserPosts(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	posts, err := apiCfg.DB.GetUserPosts(r.Context(), username)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve user posts %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}
