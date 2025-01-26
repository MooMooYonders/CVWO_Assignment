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

//get page posts

func (apiCfg apiConfig) handleGetPagePostsAsc(w http.ResponseWriter, r *http.Request) {
	pagename := chi.URLParam(r, "pagename")

	pageposts, err := apiCfg.DB.GetPagePostsAsc(r.Context(), stringtonullstring(pagename))
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error getting page posts %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(pageposts))
}

func (apiCfg apiConfig) handleGetPagePostsDesc(w http.ResponseWriter, r *http.Request) {
	pagename := chi.URLParam(r, "pagename")

	pageposts, err := apiCfg.DB.GetPagePostsDesc(r.Context(), stringtonullstring(pagename))
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

//get user posts

func (apiCfg apiConfig) handleGetUserPostsAsc(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	posts, err := apiCfg.DB.GetUserPostsAsc(r.Context(), username)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve user posts %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}

func (apiCfg apiConfig) handleGetUserPostsDesc(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	posts, err := apiCfg.DB.GetUserPostsDesc(r.Context(), username)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve user posts %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}

//get posts ordered by notifications

func (apiCfg apiConfig) handleGetUserPostsOrderedByNotifications(w http.ResponseWriter, r *http.Request) {
	username := chi.URLParam(r, "username")
	posts, err := apiCfg.DB.GetUserPostsOrderedByNotifications(r.Context(), username)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve user posts %v", err))
		return
	}

	respondWithJSON(w, 200, databaseOrderedPoststoOrderedPosts(posts))
}

// get user posts by pagename

func (apiCfg apiConfig) handleGetUserPostsByPagename(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Username string `json:"username"`
		Pagename string `json:"pagename"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to decode parameters for get user posts by pagename %v", err))
		return
	}

	posts, err := apiCfg.DB.GetUserPostsByPagename(r.Context(), database.GetUserPostsByPagenameParams{
		Username: params.Username,
		Pagename: stringtonullstring(params.Pagename),
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to get user posts by pagename %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}

func (apiCfg apiConfig) handleGetPostByPostID(w http.ResponseWriter, r *http.Request) {
	post_id := chi.URLParam(r, "post_id")
	post_uuid, err := uuid.Parse(post_id)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to parse post ID %v", err))
		return
	}

	post, err := apiCfg.DB.GetPostByPostID(r.Context(), post_uuid)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve specified post %v", err))
		return
	}

	respondWithJSON(w, 200, databasePosttoPost(post))
}

// get posts like title

func (apiCfg apiConfig) handleGetPostsLikeTitleAsc(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Pagename string `json:"pagename"`
		Title    string `json:"title"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to decode params %v", err))
		return
	}

	posts, err := apiCfg.DB.GetPostsLikeTitleAsc(r.Context(), database.GetPostsLikeTitleAscParams{
		Pagename: stringtonullstring(params.Pagename),
		Column2:  stringtonullstring(params.Title),
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to get posts like title %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}

func (apiCfg apiConfig) handleGetPostsLikeTitleDesc(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Pagename string `json:"pagename"`
		Title    string `json:"title"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to decode params %v", err))
		return
	}

	posts, err := apiCfg.DB.GetPostsLikeTitleDesc(r.Context(), database.GetPostsLikeTitleDescParams{
		Pagename: stringtonullstring(params.Pagename),
		Column2:  stringtonullstring(params.Title),
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to get posts like title %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}

// get posts by tags
func (apiCfg apiConfig) handleGetPostsByTagsAsc(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Pagename string   `json:"pagename"`
		Tags     []string `json:"tags"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error retrieving parameters of pagename and tags %v", err))
		return
	}

	posts, err := apiCfg.DB.GetPostsByTagsAsc(r.Context(), database.GetPostsByTagsAscParams{
		Pagename: stringtonullstring(params.Pagename),
		Column2:  params.Tags,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to get posts like tags %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}

func (apiCfg apiConfig) handleGetPostsByTagsDesc(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Pagename string   `json:"pagename"`
		Tags     []string `json:"tags"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error retrieving parameters of pagename and tags %v", err))
		return
	}

	posts, err := apiCfg.DB.GetPostsByTagsDesc(r.Context(), database.GetPostsByTagsDescParams{
		Pagename: stringtonullstring(params.Pagename),
		Column2:  params.Tags,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to get posts like tags %v", err))
		return
	}

	respondWithJSON(w, 200, databasePoststoPosts(posts))
}
