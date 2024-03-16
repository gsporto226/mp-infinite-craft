package main

import (
	"database/sql"
	"flag"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"

	"github.com/gorilla/websocket"
)

// TODO: Simple user auth with server provided tokens
// TODO: Lobbying?
// TODO: Server side logic:
// --> Merging, Requesting a client-side merge, synchronization of mouse position, undo?,
// --> what else?

var addr = flag.String("addr", "localhost:8070", "http service address")

func checkOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	return origin == "https://neal.fun"
}

func buildHandler(server *MainServer, upgrader websocket.Upgrader) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Print("upgrade:", err)
			return
		}
		defer c.Close()
		for {
			mt, message, err := c.ReadMessage()
			if err != nil {
				log.Println("read:", err)
				break
			}

			err = c.WriteMessage(mt, message)
			if err != nil {
				log.Println("write:", err)
				break
			}
		}
	}
}

func buildMainServer() MainServer {
	database, err := sql.Open("sqlite3", "file:database.sqlite?cache=shared")
	if err != nil {
		log.Fatal(err)
	}
	return MainServer{
		database,
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)
	upgrader := websocket.Upgrader{
		CheckOrigin:       checkOrigin,
		EnableCompression: true,
	}
	main_server := buildMainServer()
	defer main_server.Close()
	websocket_handler := buildHandler(&main_server, upgrader)
	http.HandleFunc("/open", websocket_handler)
	log.Printf("Http server waiting for upgrade requests at %s/open", *addr)
	log.Fatal(http.ListenAndServe(*addr, nil))
}
