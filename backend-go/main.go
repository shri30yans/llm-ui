package main

import (
    "fmt"
    "log"
    "net/http"
    "os"

    "lumos/backend/api"
    "lumos/backend/core"

    "github.com/gorilla/mux"
    "github.com/joho/godotenv"
)

func init() {
    // Load .env file
    if err := godotenv.Load(); err != nil {
        log.Printf("Warning: .env file not found: %v", err)
    }
}

func main() {
    // Initialize LLM client
    llmClient, err := core.NewMistralClient()
    if err != nil {
        log.Fatalf("Failed to initialize LLM client: %v", err)
    }

    // Initialize session manager
    sessionManager := core.NewSessionManager()

    // Initialize handler
    handler := api.NewHandler(sessionManager, llmClient)

    // Initialize router
    router := mux.NewRouter()

    // Register middleware first
    router.Use(api.CORSMiddleware)
    router.Use(api.LoggingMiddleware)
    
    // Register routes after middleware
    api.RegisterRoutes(router, handler)

    // Get port from environment or use default
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    // Start server
    fmt.Printf("Server starting on port %s...\n", port)
    fmt.Printf("API available at http://localhost:%s/api/\n", port)
    if err := http.ListenAndServe(":"+port, router); err != nil {
        log.Fatalf("Server failed to start: %v", err)
    }
}
