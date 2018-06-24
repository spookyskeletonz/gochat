package main

type Message struct {
	UserName string `json:userName`
	RoomName string `json:roomName`
	Message  string `json:message`
}
