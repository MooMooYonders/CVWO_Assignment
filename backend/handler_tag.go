package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
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
