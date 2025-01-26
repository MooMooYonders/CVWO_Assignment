package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func (apiCfg apiConfig) handleCreatePostTag(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		PostID string `json:"post_id"`
		TagIDs []int  `json:"tag_ids"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not get post tag params %v", err))
		log.Printf("Error: %v", err)
		return
	}

	post_id, err := uuid.Parse(params.PostID)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not parse post_id for post tags %v", err))
		log.Printf("Error: %v", err)
		return
	}

	post_tags := []PostTag{}
	for _, tag := range params.TagIDs {
		post_tag, err := apiCfg.DB.CreatePostTag(r.Context(), database.CreatePostTagParams{
			PostID: post_id,
			TagID:  int32(tag),
		})
		if err != nil {
			respondWithError(w, 400, fmt.Sprintf("Failed to create post tag %v", err))
			log.Printf("Error: %v", err)
			return
		}
		post_tags = append(post_tags, databasePostTagtoPostTag(post_tag))
	}

	respondWithJSON(w, 200, post_tags)

}

func (apiCfg apiConfig) handleGetPostTagsByPostID(w http.ResponseWriter, r *http.Request) {
	post_id := chi.URLParam(r, "post_id")

	post_uuid, err := uuid.Parse(post_id)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not parse post_id for post tags %v", err))
		log.Printf("Error: %v", err)
		return
	}

	tag_names, err := apiCfg.DB.GetPostTagsByPostID(r.Context(), post_uuid)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error retrieving post tags %v", err))
		return
	}

	respondWithJSON(w, 200, tag_names)

}
