package api

import (
    "log"
    "net/http"
)

// CORSMiddleware handles CORS headers
func CORSMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Set CORS headers
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Max-Age", "3600")
        w.Header().Set("Access-Control-Allow-Credentials", "true")

        // Handle preflight requests
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}

// LoggingMiddleware logs all requests
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Printf("%s %s\n", r.Method, r.RequestURI)
        next.ServeHTTP(w, r)
    })
}
