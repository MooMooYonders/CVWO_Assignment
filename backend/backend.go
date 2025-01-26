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
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	//USERS
	router.Post("/users", apiCfg.handlerCreateUser)
	router.Get("/users/{username}", apiCfg.handleGetUser)
	router.Patch("/users/{username}", apiCfg.handleUpdateLastSeen)
	router.Get("/users/last_seen/{username}", apiCfg.handleGetLastSeen)

	//PAGES
	router.Post("/pages", apiCfg.handleCreatePage)
	router.Get("/pages", apiCfg.handleGetPages)
	router.Get("/pages/{pagename}", apiCfg.handleGetPage)

	//POSTS
	// posts by page
	router.Get("/posts/page/{pagename}/asc", apiCfg.handleGetPagePostsAsc)
	router.Get("/posts/page/{pagename}/desc", apiCfg.handleGetPagePostsDesc)

	// user posts
	router.Get("/posts/user/{username}/asc", apiCfg.handleGetUserPostsAsc)
	router.Get("/posts/user/{username}/desc", apiCfg.handleGetUserPostsDesc)

	router.Post("/posts", apiCfg.handleCreatePost)
	router.Get("/posts/{post_id}", apiCfg.handleGetPostByPostID)

	// posts like title
	router.Post("/posts/page/title/asc", apiCfg.handleGetPostsLikeTitleAsc)
	router.Post("/posts/page/title/desc", apiCfg.handleGetPostsLikeTitleDesc)

	//posts by tags
	router.Post("/posts/page/tags/asc", apiCfg.handleGetPostsByTagsAsc)
	router.Post("/posts/page/tags/desc", apiCfg.handleGetPostsByTagsDesc)

	router.Post("/posts/user/pagename", apiCfg.handleGetUserPostsByPagename)
	router.Get("/posts/user/{username}/notifications", apiCfg.handleGetUserPostsOrderedByNotifications)

	//TAGS
	router.Post("/tags", apiCfg.handleCreateTag)
	router.Get("/tags/{post_id}", apiCfg.handleGetPostTagsByPostID)
	router.Post("/tags/name/page", apiCfg.handleGetTagsLikeNameAndByPage)
	router.Get("/tags/page/{pagename}", apiCfg.handleGetTagsByPage)
	router.Get("/tags/page/{pagename}/popular", apiCfg.handleGetPopularTagsByPage)

	//POSTTAGS
	router.Post("/post_tags", apiCfg.handleCreatePostTag)

	//COMMENTS
	router.Post("/comments", apiCfg.handleCreateComment)
	router.Get("/comments/post/{post_id}", apiCfg.handleGetCommentsByPostID)
	router.Get("/comments/comment/{comment_id}", apiCfg.handleGetCommentByID)
	router.Get("/comments/unread/{post_id}", apiCfg.handleGetUnreadCommentsByPostID)
	router.Get("/comments/read/{post_id}", apiCfg.handleGetReadCommentsByPostID)
	router.Put("/comments/user_last_seen/{post_id}", apiCfg.handleUpdateCommentsUserLastSeen)

	srv := &http.Server{
		Handler: router,
		Addr:    ":" + portString,
	}

	log.Printf("Server starting on port %v", portString)
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
