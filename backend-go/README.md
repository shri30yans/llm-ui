# Go Backend Implementation Plan

## Overview
This document outlines the implementation plan for a Go backend using gorilla/mux and Langchain Go with Mistral LLM integration.

## Architecture

The backend follows a clean architecture pattern with the following components:

```
backend-go/
├── main.go              # Entry point
├── go.mod              # Module definition
├── api/
│   └── handlers.go     # HTTP handlers
├── models/
│   └── chat.go         # Data structures
└── core/
    ├── session.go      # Session management
    └── llm.go          # Mistral integration
```

## Dependencies

```go
require (
    github.com/gorilla/mux v1.8.1
    github.com/tmc/langchaingo v0.1.0
    github.com/google/uuid v1.6.0
)
```

## Data Models

### Chat Models
```go
type ChatMessage struct {
    Message         string    `json:"message"`
    ConversationID uuid.UUID `json:"conversation_id,omitempty"`
    Timestamp      time.Time `json:"timestamp"`
}

type ChatResponse struct {
    Response       string    `json:"response"`
    ConversationID uuid.UUID `json:"conversation_id"`
    Timestamp      time.Time `json:"timestamp"`
}

type ChatSession struct {
    ID        uuid.UUID          `json:"id"`
    CreatedAt time.Time         `json:"created_at"`
    UpdatedAt time.Time         `json:"updated_at"`
    Messages  []MessageHistory  `json:"messages"`
}

type MessageHistory struct {
    Role      string    `json:"role"`
    Content   string    `json:"content"`
    Timestamp time.Time `json:"timestamp"`
}
```

## API Endpoints

### 1. Create Session
```
POST /sessions
Response: ChatSession
```

### 2. Get Session
```
GET /sessions/{session_id}
Response: ChatSession
```

### 3. Chat Message
```
POST /chat
Request: ChatMessage
Response: ChatResponse
```

### 4. Delete Session
```
DELETE /sessions/{session_id}
Response: {"message": "Session deleted successfully"}
```

## Core Components

### Session Manager
- In-memory storage using sync.Map
- Session cleanup with configurable TTL
- Thread-safe operations

### Mistral Integration
- API Key configuration via environment variables
- Error handling and retries
- Message context management

## Implementation Steps

1. **Project Initialization**
   ```bash
   mkdir backend-go
   cd backend-go
   go mod init lumos/backend
   ```

2. **Install Dependencies**
   ```bash
   go get github.com/gorilla/mux
   go get github.com/tmc/langchaingo
   go get github.com/google/uuid
   ```

3. **Environment Setup**
   ```bash
   # .env
   MISTRAL_API_KEY=zj952hc5snA0oCyO1n1JEuKGVQtjnPvz
   PORT=8080
   ```

4. **Core Implementation Order**
   1. Data models
   2. Session manager
   3. Mistral LLM integration
   4. API handlers
   5. Main server setup

## Error Handling

Standard error responses:
```json
{
    "error": {
        "code": "string",
        "message": "string"
    }
}
```

Error codes:
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Testing

Run tests:
```bash
go test ./...
```

## Running the Server

```bash
go run main.go
```

The server will start on port 8080 by default.