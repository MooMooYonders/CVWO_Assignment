package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func stringToNullUUID(s string) (uuid.NullUUID, error) {
	var nullUUID uuid.NullUUID
	if s == "" {
		nullUUID.Valid = false
	} else {
		parsedUUID, err := uuid.Parse(s)
		if err != nil {
			return nullUUID, err
		}
		nullUUID.UUID = parsedUUID
		nullUUID.Valid = true
	}
	return nullUUID, nil
}

func inttoNullint32(num *int) sql.NullInt32 {
	var nullint32 sql.NullInt32
	if num == nil {
		nullint32.Valid = false
		return nullint32
	}
	nullint32.Valid = true
	nullint32.Int32 = int32(*num)
	return nullint32
}

func (apiCfg apiConfig) handleCreateComment(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		PostID   string `json:"post_id"`
		Username string `json:"username"`
		Content  string `json:"content"`
		ReplyTo  *int   `json:"reply_to"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve comment params %v", err))
		log.Println(err)
		return
	}

	post_id, err := stringToNullUUID(params.PostID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not parse post ID %v", err))
		log.Println(err)
		return
	}

	reply_to := inttoNullint32(params.ReplyTo)

	comment, err := apiCfg.DB.CreateComment(r.Context(), database.CreateCommentParams{
		PostID:       post_id,
		CreatedAt:    time.Now().UTC(),
		UpdatedAt:    time.Now().UTC(),
		Username:     params.Username,
		Content:      params.Content,
		ReplyTo:      reply_to,
		UserLastSeen: time.Date(1, time.January, 1, 0, 0, 0, 0, time.UTC),
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not create comment %v", err))
		log.Println(err)
		return
	}

	respondWithJSON(w, 200, databaseCommenttoComment(comment))

}

func (apiCfg apiConfig) handleGetCommentsByPostID(w http.ResponseWriter, r *http.Request) {
	post_id := chi.URLParam(r, "post_id")

	post_nulluuid, err := stringToNullUUID(post_id)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not parse uuid %v", err))
		return
	}

	comments, err := apiCfg.DB.GetCommentsByPostID(r.Context(), post_nulluuid)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not get comments %v", err))
		return
	}

	respondWithJSON(w, 200, databaseCommentstoComments(comments))
}

func (apiCfg apiConfig) handleGetCommentByID(w http.ResponseWriter, r *http.Request) {
	comment_str := chi.URLParam(r, "comment_id")
	comment_id, err := strconv.Atoi(comment_str)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to get comment id %v", err))
		return
	}

	comment, err := apiCfg.DB.GetCommentByID(r.Context(), int32(comment_id))
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve comment %v", err))
		return
	}

	respondWithJSON(w, 200, databaseCommenttoComment(comment))
}

func (apiCfg apiConfig) handleGetUnreadCommentsByPostID(w http.ResponseWriter, r *http.Request) {
	post_id := chi.URLParam(r, "post_id")

	post_nulluuid, err := stringToNullUUID(post_id)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not parse uuid %v", err))
		return
	}

	comments, err := apiCfg.DB.GetUnreadCommentsByPostID(r.Context(), post_nulluuid)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve comments %v", err))
		return
	}

	respondWithJSON(w, 200, databaseCommentstoComments(comments))
}

func (apiCfg apiConfig) handleGetReadCommentsByPostID(w http.ResponseWriter, r *http.Request) {
	post_id := chi.URLParam(r, "post_id")

	post_nulluuid, err := stringToNullUUID(post_id)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not parse uuid %v", err))
		return
	}

	comments, err := apiCfg.DB.GetReadCommentsByPostID(r.Context(), post_nulluuid)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to retrieve comments %v", err))
		return
	}

	respondWithJSON(w, 200, databaseCommentstoComments(comments))
}

func (apiCfg apiConfig) handleUpdateCommentsUserLastSeen(w http.ResponseWriter, r *http.Request) {
	post_id := chi.URLParam(r, "post_id")

	post_nulluuid, err := stringToNullUUID(post_id)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not parse uuid %v", err))
		return
	}

	err = apiCfg.DB.UpdateCommentsUserLastSeen(r.Context(), database.UpdateCommentsUserLastSeenParams{
		UserLastSeen: time.Now().UTC(),
		PostID:       post_nulluuid,
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not update comments user last seen %v", err))
		return
	}

}
