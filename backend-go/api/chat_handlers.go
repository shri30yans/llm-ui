package api

import (
    "encoding/json"
    "net/http"
    "time"
    "github.com/google/uuid"
    "lumos/backend/core"
    "lumos/backend/models"
)

// CreateConversation creates a new chat conversation
func (h *Handler) CreateConversation(w http.ResponseWriter, r *http.Request) {
    session := h.sessionManager.CreateSession()
    
    response := models.ChatSession{
        ID:        session.ID,
        CreatedAt: time.Now().UTC(),
    }

    respondWithJSON(w, http.StatusCreated, response)
}

// SendMessage sends a message
func (h *Handler) SendMessage(w http.ResponseWriter, r *http.Request) {
    var payload struct {
        Message        string    `json:"message"`
        ConversationID string    `json:"conversation_id"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        respondWithError(w, http.StatusBadRequest, "Invalid request payload")
        return
    }

    sessionID, err := uuid.Parse(payload.ConversationID)
    if err != nil {
        respondWithError(w, http.StatusBadRequest, "Invalid conversation ID")
        return
    }

    // Process message
    response, err := h.sessionManager.ProcessMessage(sessionID, payload.Message, h.llmClient)
    if err != nil {
        if err == core.ErrSessionNotFound {
            respondWithError(w, http.StatusNotFound, "Conversation not found")
            return
        }
        respondWithError(w, http.StatusInternalServerError, "Failed to process message")
        return
    }

    chatResponse := models.ChatResponse{
        Response:       response,
        ConversationID: sessionID,
        Timestamp:      time.Now().UTC(),
    }

    respondWithJSON(w, http.StatusOK, chatResponse)
}

// DeleteConversation deletes a conversation
func (h *Handler) DeleteConversation(w http.ResponseWriter, r *http.Request) {
    var payload struct {
        ConversationID string `json:"conversation_id"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        respondWithError(w, http.StatusBadRequest, "Invalid request payload")
        return
    }

    sessionID, err := uuid.Parse(payload.ConversationID)
    if err != nil {
        respondWithError(w, http.StatusBadRequest, "Invalid conversation ID")
        return
    }

    // Delete the session
    err = h.sessionManager.DeleteSession(sessionID)
    if err != nil {
        if err == core.ErrSessionNotFound {
            respondWithError(w, http.StatusNotFound, "Conversation not found")
            return
        }
        respondWithError(w, http.StatusInternalServerError, "Failed to delete conversation")
        return
    }

    respondWithJSON(w, http.StatusOK, map[string]string{"status": "success"})
}
