package models

import (
	"time"

	"github.com/google/uuid"
)

// ChatMessage represents an incoming chat message
type ChatMessage struct {
	Message        string    `json:"message"`
	ConversationID uuid.UUID `json:"conversation_id,omitempty"`
	Timestamp      time.Time `json:"timestamp"`
}

// ChatResponse represents the response to a chat message
type ChatResponse struct {
Response       string    `json:"response"`
ConversationID uuid.UUID `json:"conversation_id"`
Timestamp      time.Time `json:"timestamp"`
}

// MessageHistory represents a message in the chat history
type MessageHistory struct {
	Role      string    `json:"role"`
	Content   string    `json:"content"`
	Timestamp time.Time `json:"timestamp"`
}

// ChatSession represents a chat session with message history
type ChatSession struct {
	ID        uuid.UUID        `json:"id"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`
	Messages  []MessageHistory `json:"messages"`
}

// NewChatSession creates a new chat session with initialized fields
func NewChatSession() *ChatSession {
	now := time.Now().UTC()
	return &ChatSession{
		ID:        uuid.New(),
		CreatedAt: now,
		UpdatedAt: now,
		Messages:  make([]MessageHistory, 0),
	}
}

// AddMessage adds a new message to the chat session
func (s *ChatSession) AddMessage(role string, content string) {
	s.Messages = append(s.Messages, MessageHistory{
		Role:      role,
		Content:   content,
		Timestamp: time.Now().UTC(),
	})
	s.UpdatedAt = time.Now().UTC()
}
