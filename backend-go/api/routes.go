package api

import (
    "github.com/gorilla/mux"
)

// RegisterRoutes sets up all API routes
func RegisterRoutes(router *mux.Router, h *Handler) {
    // Create API subrouter
    apiRouter := router.PathPrefix("/api").Subrouter()
    
    // Action-based chat endpoints
    apiRouter.HandleFunc("/chat/create", h.CreateConversation).Methods("POST", "OPTIONS")
    apiRouter.HandleFunc("/chat/send", h.SendMessage).Methods("POST", "OPTIONS")
    apiRouter.HandleFunc("/chat/delete", h.DeleteConversation).Methods("POST", "OPTIONS")
}
