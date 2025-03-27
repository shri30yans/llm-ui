package api

import (
    "lumos/backend/core"
)

// Handler holds dependencies for API handlers
type Handler struct {
    sessionManager *core.SessionManager
    llmClient     core.LLMClient  // Changed from *core.LLMClient to core.LLMClient
}

// NewHandler creates a new Handler instance
func NewHandler(sessionManager *core.SessionManager, llmClient core.LLMClient) *Handler {
    return &Handler{
        sessionManager: sessionManager,
        llmClient:     llmClient,
    }
}
