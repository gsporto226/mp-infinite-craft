package main

import "database/sql"

type MainServer struct {
	database *sql.DB
}

func (main_server *MainServer) Close() {

}
