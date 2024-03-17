package websocketpayload

import (
	"github.com/google/uuid"
)

type Payload struct {
	Kind    string `json: 'kind'`
	Payload any    `json: 'payload'`
}

type HandshakePayload struct {
	UserToken uuid.UUID `json: 'user_token'`
}
