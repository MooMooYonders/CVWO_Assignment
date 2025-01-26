package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
	"github.com/go-chi/chi"
	"github.com/google/uuid"
)

func (apiCfg apiConfig) handleCreatePage(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		Name string `json:"name"`
	}
	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error parsing JSON %v", err))
		return
	}

	if params.Name == "" {
		respondWithError(w, 400, "No name provided")
		return
	}

	pageinfo, err := apiCfg.DB.GetPage(r.Context(), params.Name)
	if err == nil {
		respondWithError(w, 400, fmt.Sprintf("Cannot use repeated name: %v", pageinfo.Name))
		return
	}

	page, err := apiCfg.DB.CreatePage(r.Context(), database.CreatePageParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      params.Name,
	})

	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error creating user %v", err))
		return
	}
	respondWithJSON(w, 200, databasePagetoPage(page))
}

func (apiCfg apiConfig) handleGetPages(w http.ResponseWriter, r *http.Request) {
	pages, err := apiCfg.DB.GetPages(r.Context())
	if err != nil {
		respondWithError(w, 500, fmt.Sprintf("Failed to get pages %v", err))
		return
	}
	respondWithJSON(w, 200, databasePagestoPages(pages))
}

func (apiCfg apiConfig) handleGetPage(w http.ResponseWriter, r *http.Request) {
	pagename := chi.URLParam(r, "pagename")
	page, err := apiCfg.DB.GetPage(r.Context(), pagename)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Could not get the page %v", err))
		return
	}
	respondWithJSON(w, 200, databasePagetoPage(page))
}
