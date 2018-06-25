package main

import "github.com/gorilla/websocket"

type Message struct {
	UserName string `json:userName`
	RoomName string `json:roomName`
	Message  string `json:message`
}

type Room struct {
	RoomName  string
	clients   map[*websocket.Conn]bool
	broadcast chan Message
}

func newRoom(roomname string) Room {
	clientsMap := make(map[*websocket.Conn]bool)
	broadcastQueue := make(chan Message)

	return Room{
		RoomName:  roomname,
		clients:   clientsMap,
		broadcast: broadcastQueue}
}
