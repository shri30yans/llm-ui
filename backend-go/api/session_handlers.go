package api

import (
    "net/http"

    "github.com/google/uuid"
    "github.com/gorilla/mux"
    "lumos/backend/core"
)

// CreateSession handles creation of new chat sessions
func (h *Handler) CreateSession(w http.ResponseWriter, r *http.Request) {
    session := h.sessionManager.CreateSession()
    respondWithJSON(w, http.StatusCreated, session)
}

// GetSession handles retrieval of existing chat sessions
func (h *Handler) GetSession(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    sessionID, err := uuid.Parse(vars["session_id"])
    if err != nil {
        respondWithError(w, http.StatusBadRequest, "Invalid session ID")
        return
    }

    session, err := h.sessionManager.GetSession(sessionID)
    if err != nil {
        if err == core.ErrSessionNotFound {
            respondWithError(w, http.StatusNotFound, "Session not found")
            return
        }
        respondWithError(w, http.StatusInternalServerError, "Failed to get session")
        return
    }

    respondWithJSON(w, http.StatusOK, session)
}

// DeleteSession handles deletion of chat sessions
func (h *Handler) DeleteSession(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    sessionID, err := uuid.Parse(vars["session_id"])
    if err != nil {
        respondWithError(w, http.StatusBadRequest, "Invalid session ID")
        return
    }

    if err := h.sessionManager.DeleteSession(sessionID); err != nil {
        if err == core.ErrSessionNotFound {
            respondWithError(w, http.StatusNotFound, "Session not found")
            return
        }
        respondWithError(w, http.StatusInternalServerError, "Failed to delete session")
        return
    }

    respondWithJSON(w, http.StatusOK, map[string]string{"message": "Session deleted successfully"})
}
