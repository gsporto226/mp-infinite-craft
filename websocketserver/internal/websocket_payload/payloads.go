package websocketpayload

import (
	"github.com/google/uuid"
)

//tygo:emit export type WebsocketPayload = IdentifyPayload | IdentifyPayload | IdentifiedPayload
type IdentifyPayload struct {
	Kind string `json:"kind" tstype:"'IDENTIFY'"`
}

type IdentityPayload struct {
	Kind      string    `json:"kind" tstype:"'IDENTITY'"`
	UserToken uuid.UUID `json:"user_token"`
}

type IdentifiedPayload struct {
	Kind string `json:"kind" tstype:"'IDENTIFIED'"`
}
