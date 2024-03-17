package main

import (
	"encoding/json"
	"io"

	"github.com/gorilla/websocket"
)

func ReadJSONStrict(c *websocket.Conn, v interface{}) error {
	_, r, err := c.NextReader()
	if err != nil {
		return err
	}
	decoder := json.NewDecoder(r)
	decoder.DisallowUnknownFields()
	err = decoder.Decode(v)
	if err == io.EOF {
		// One value is expected in the message.
		err = io.ErrUnexpectedEOF
	}
	return err
}
