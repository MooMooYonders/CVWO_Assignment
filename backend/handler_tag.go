package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
	"github.com/go-chi/chi"
)

func (apiCfg apiConfig) handleCreateTag(w http.ResponseWriter, r *http.Request) {
	type tagSlice struct {
		Tags []string `json:"tags"`
	}
	decoder := json.NewDecoder(r.Body)
	tags := tagSlice{}
	err := decoder.Decode(&tags)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not retrieve tags %v", err))
		return
	}

	tagEntries := []database.CreateTagRow{}
	for _, tag := range tags.Tags {
		entry, err := apiCfg.DB.CreateTag(r.Context(), tag)
		if err != nil {
			respondWithError(w, 400, fmt.Sprintf("Could not create tags %v", err))
			return
		}
		tagEntries = append(tagEntries, entry)
	}

	respondWithJSON(w, 200, databaseTagsToTags(tagEntries))

}

func (apiCfg apiConfig) handleGetTagsByPage(w http.ResponseWriter, r *http.Request) {
	pagename := chi.URLParam(r, "pagename")

	tags, err := apiCfg.DB.GetTagsByPage(r.Context(), stringtonullstring(pagename))
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Unable to get tags by page %v", err))
		return
	}

	respondWithJSON(w, 200, tags)
}

func (apiCfg apiConfig) handleGetPopularTagsByPage(w http.ResponseWriter, r *http.Request) {
	pagename := chi.URLParam(r, "pagename")

	tags, err := apiCfg.DB.GetPopularPageTags(r.Context(), stringtonullstring(pagename))
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Unable to get tags by page %v", err))
		return
	}

	respondWithJSON(w, 200, databasePopularTagstoPopularTags(tags))
}

func (apiCfg apiConfig) handleGetTagsLikeNameAndByPage(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Pagename string `json:"pagename"`
		Name     string `json:"name"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not retrieve tags like name %v", err))
		return
	}

	tags, err := apiCfg.DB.GetTagsLikeNameAndByPage(r.Context(), database.GetTagsLikeNameAndByPageParams{
		Pagename: stringtonullstring(params.Pagename),
		Column2:  stringtonullstring(params.Name),
	})
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Failed to get tags like name %v", err))
		return
	}

	respondWithJSON(w, 200, tags)
}
