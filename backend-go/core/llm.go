package core

import (
    "bytes"
    "context"
    "encoding/json"
    "errors"
    "fmt"
    "io"
    "net/http"
    "os"
    "lumos/backend/models"
)

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

// LLMClient interface defines methods for LLM interaction
type LLMClient interface {
    GenerateResponse(message string, history []models.MessageHistory) (string, error)
}

// MistralClient implements LLMClient using Mistral API
type MistralClient struct {
    apiKey string
    client *http.Client
}

// Message represents a chat message for the Mistral API
type Message struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

// ChatRequest represents the request body for the Mistral API
type ChatRequest struct {
    Model    string    `json:"model"`
    Messages []Message `json:"messages"`
}

// ChatResponse represents the response from the Mistral API
type ChatResponse struct {
    ID      string `json:"id"`
    Object  string `json:"object"`
    Created int64  `json:"created"`
    Choices []struct {
        Message Message `json:"message"`
    } `json:"choices"`
}

// NewMistralClient creates a new Mistral LLM client
func NewMistralClient() (*MistralClient, error) {
    apiKey := os.Getenv("MISTRAL_API_KEY")
    if apiKey == "" {
        return nil, errors.New("MISTRAL_API_KEY environment variable is not set")
    }

    return &MistralClient{
        apiKey: apiKey,
        client: &http.Client{},
    }, nil
}

// GenerateResponse generates a response using the Mistral API
func (c *MistralClient) GenerateResponse(message string, history []models.MessageHistory) (string, error) {
    ctx := context.Background()

    // Convert message history to Mistral format
    messages := make([]Message, 0, len(history)+1)
    for _, msg := range history {
        messages = append(messages, Message{
            Role:    msg.Role,
            Content: msg.Content,
        })
    }

    // Add current message
    messages = append(messages, Message{
        Role:    "user",
        Content: message,
    })

    // Create request body
    reqBody := ChatRequest{
        Model:    "mistral-medium",
        Messages: messages,
    }

    // Marshal request body
    jsonBody, err := json.Marshal(reqBody)
    if err != nil {
        return "", fmt.Errorf("failed to marshal request: %w", err)
    }

    // Create request
    req, err := http.NewRequestWithContext(ctx, "POST", MISTRAL_API_URL, bytes.NewBuffer(jsonBody))
    if err != nil {
        return "", fmt.Errorf("failed to create request: %w", err)
    }

    // Set headers
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("Authorization", "Bearer "+c.apiKey)

    // Send request
    resp, err := c.client.Do(req)
    if err != nil {
        return "", fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()

    // Read response body
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return "", fmt.Errorf("failed to read response body: %w", err)
    }

    // Check status code
    if resp.StatusCode != http.StatusOK {
        return "", fmt.Errorf("API request failed with status %d: %s", resp.StatusCode, string(body))
    }

    // Parse response
    var chatResp ChatResponse
    if err := json.Unmarshal(body, &chatResp); err != nil {
        return "", fmt.Errorf("failed to parse response: %w", err)
    }

    // Check if we have any choices
    if len(chatResp.Choices) == 0 {
        return "", errors.New("no response generated")
    }

    return chatResp.Choices[0].Message.Content, nil
}