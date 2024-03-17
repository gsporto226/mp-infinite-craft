package main

import (
	"database/sql"
	"log"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/gsporto226/mp-infinite-craft/cmd/websocket-server/domain"
	"github.com/gsporto226/mp-infinite-craft/internal/websocket_payload"
)

const (
	identifyTimeout = 5 * time.Second
)

type MainServer struct {
	database          *sql.DB
	userCollection    *domain.UserCollection
	activeConnections []*websocket.Conn
}

func NewMainServer(database *sql.DB, userCollection *domain.UserCollection) MainServer {
	return MainServer{
		database:          database,
		activeConnections: make([]*websocket.Conn, 10),
		userCollection:    userCollection,
	}
}

func (mainServer *MainServer) Close() {
	mainServer.database.Close()
}

func (mainServer *MainServer) Initialize() {
	mainServer.userCollection.EnsureTable()
}

func (mainServer *MainServer) DoOnce() {
	uuid, err := uuid.NewV7()
	if err != nil {
		log.Fatal(err)
	}
	log.Printf("User Token %s", uuid)
	mainServer.userCollection.Create(&domain.User{
		ID: uuid,
	})
}

func (mainServer *MainServer) HandleNewConnection(connection *websocket.Conn) {
	identifyPayload := websocketpayload.IdentifyPayload{
		Kind: "IDENTIFY",
	}
	// Request Identification
	err := connection.WriteJSON(identifyPayload)
	log.Printf("Requesting Identification to %p", connection)
	if err != nil {
		log.Printf("Closed connection to %p: %s", connection, err.Error())
		connection.Close()
	}
	// Expect Identification
	var handshakePayload websocketpayload.IdentityPayload
	timeoutTimer := time.NewTimer(identifyTimeout)
	err_chan := make(chan error)
	go func() {
		err_chan <- ReadJSONStrict(connection, &handshakePayload)
	}()
	select {
	case _ = <-timeoutTimer.C:
		connection.WriteMessage(websocket.CloseMessage, []byte("identity timeout"))
		log.Printf("Closed connection to %p: Identify Timeout", connection)
		return
	case err = <-err_chan:
		timeoutTimer.Stop()
		if err != nil {
			log.Printf("Closed connection to %p: %s", connection, err.Error())
			connection.Close()
			return
		}
	}
	// Check if user exists, passing the user ID is what acts as authorization.
	// Weak, but it should suffice since there is no intention of having servers be publicly
	// accessed
	log.Printf("Client sent token %s", handshakePayload.UserToken)
	_, err = mainServer.userCollection.Get(handshakePayload.UserToken)
	if err != nil {
		log.Printf("Client %p is full of shit", connection)
		log.Printf("Error %s", err.Error())
		connection.WriteMessage(websocket.CloseMessage, []byte("Invalid token"))
		return
	}
	log.Printf("Client %p identified successfully", connection)
	connection.WriteJSON(websocketpayload.IdentifiedPayload{Kind: "IDENTIFIED"})
}
