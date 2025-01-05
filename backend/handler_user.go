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

func (apiCfg *apiConfig) handlerCreateUser(w http.ResponseWriter, r *http.Request) {
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

	user, err := apiCfg.DB.CreateUser(r.Context(), database.CreateUserParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      params.Name,
	})

	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error creating user %v", err))
		return
	}
	respondWithJSON(w, 200, databaseUsertoUser(user))
}

func (apiCfg apiConfig) handleGetUser(w http.ResponseWriter, r *http.Request) {
	paramname := chi.URLParam(r, "username")

	type name struct {
		Name string `json:"name"`
	}

	username, err := apiCfg.DB.GetUser(r.Context(), paramname)
	if err != nil {
		respondWithError(w, 400, fmt.Sprintf("Error logging user %v", err))
		return
	}
	if username == "" {
		respondWithError(w, 400, "Name does not exist")
		return
	}
	respondWithJSON(w, 200, name{Name: username})
}
