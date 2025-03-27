package core

import (
    "errors"
    "log"
    "sync"
    "time"

    "github.com/google/uuid"
    "lumos/backend/models"
)

var (
    ErrSessionNotFound = errors.New("session not found")
)

// SessionManager handles chat session management
type SessionManager struct {
    sessions sync.Map
    mu       sync.RWMutex
}

// NewSessionManager creates a new session manager instance
func NewSessionManager() *SessionManager {
    sm := &SessionManager{}
    // Start cleanup goroutine
    go sm.cleanupSessions()
    return sm
}

// CreateSession creates a new chat session
func (sm *SessionManager) CreateSession() *models.ChatSession {
    session := models.NewChatSession()
    sm.sessions.Store(session.ID, session)
    return session
}

// GetSession retrieves a chat session by ID
func (sm *SessionManager) GetSession(id uuid.UUID) (*models.ChatSession, error) {
    if session, exists := sm.sessions.Load(id); exists {
        return session.(*models.ChatSession), nil
    }
    return nil, ErrSessionNotFound
}

// DeleteSession removes a chat session
func (sm *SessionManager) DeleteSession(id uuid.UUID) error {
    if _, exists := sm.sessions.LoadAndDelete(id); !exists {
        return ErrSessionNotFound
    }
    return nil
}

// ProcessMessage processes a chat message in the given session
func (sm *SessionManager) ProcessMessage(sessionID uuid.UUID, message string, llmClient LLMClient) (string, error) {
    // Get session without global lock since sync.Map is thread-safe
    session, err := sm.GetSession(sessionID)
    if err != nil {
        return "", err
    }

    // Lock only the specific session for message processing
    sm.mu.Lock()
    session.AddMessage("user", message)
    sm.mu.Unlock()

    // Process message through LLM without holding lock
    response, err := llmClient.GenerateResponse(message, session.Messages)
    if err != nil {
        return "", err
    }

    // Lock again only for updating session with response
    sm.mu.Lock()
    session.AddMessage("assistant", response)
    // Update session in map to ensure cleanup sees latest activity
    sm.sessions.Store(sessionID, session)
    sm.mu.Unlock()

    return response, nil
}

// cleanupSessions periodically removes old sessions
func (sm *SessionManager) cleanupSessions() {
    ticker := time.NewTicker(1 * time.Hour)
    defer ticker.Stop()

    for range ticker.C {
        now := time.Now()
        // Use sync.Map's built-in thread safety instead of global lock
        var sessionsToDelete []uuid.UUID

        // First pass: identify expired sessions
        sm.sessions.Range(func(key, value interface{}) bool {
            session := value.(*models.ChatSession)
            // Consider sessions inactive after 24 hours without updates
            if now.Sub(session.UpdatedAt) > 24*time.Hour {
                sessionsToDelete = append(sessionsToDelete, key.(uuid.UUID))
            }
            return true
        })

        // Second pass: delete expired sessions
        for _, id := range sessionsToDelete {
            sm.sessions.Delete(id)
            log.Printf("Cleaned up expired session: %s", id)
        }
    }
}
