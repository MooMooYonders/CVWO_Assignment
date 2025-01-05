package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/MooMooYonders/CVWO_Assignment/internal/database"
	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

type apiConfig struct {
	DB *database.Queries
}

func main() {
	godotenv.Load(".env")

	portString := os.Getenv("PORT")
	if portString == "" {
		log.Fatal("PORT is not found in environment")
	}

	DBurl := os.Getenv("DB_URL")
	if DBurl == "" {
		log.Fatal("DB is not found in environment")
	}

	conn, err := sql.Open("postgres", DBurl)
	if err != nil {
		log.Fatal("Can't connect to database")
	}

	apiCfg := apiConfig{
		DB: database.New(conn),
	}

	router := chi.NewRouter()

	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	//users
	router.Post("/users", apiCfg.handlerCreateUser)
	router.Get("/users/{username}", apiCfg.handleGetUser)

	//Pages
	router.Post("/pages", apiCfg.handleCreatePage)
	router.Get("/pages", apiCfg.handleGetPages)
	router.Get("/pages/{pagename}", apiCfg.handleGetPage)

	//Posts
	router.Get("/posts/page/{pagename}", apiCfg.handleGetPagePosts)
	router.Get("/posts/user/{username}", apiCfg.handleGetUserPosts)
	router.Post("/posts", apiCfg.handleCreatePost)

	//Tags
	router.Post("/tags", apiCfg.handleCreateTag)

	//PostTags
	router.Post("/post_tag", apiCfg.handleCreatePostTag)

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + portString,
	}

	log.Printf("Server starting on port %v", portString)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
