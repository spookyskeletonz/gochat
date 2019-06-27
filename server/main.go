package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

/* global map for rooms. for scalability use db instad */
var rooms = make(map[string]*Room)

/* upgrader to upgrade HTTP to websocket */
var upgrader = websocket.Upgrader{}

func main() {
	// create a simple file server to serve static files
	// note the realtive path is from root folder of source code, not server
	// this is because of aws eb stuff
	fs := http.FileServer(http.Dir("./client"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", handleConnections)

	log.Println("http server starting on :5001")
	err := http.ListenAndServe(":5001", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// take roomName from query param
	requestRoom := r.URL.Query().Get("roomName")
	if requestRoom == "" {
		log.Println("No room specified")
		return
	}

	log.Println("connection opening!")
	// upgrade GET request to websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("upgrade request: ", err)
	}

	// Make sure we close the connection when the function returns.
	// defers close to whenever the function is returned
	defer ws.Close()

	// either get room struct from map or create a new one
	room := rooms[requestRoom]
	if room == nil {
		// need to create a new room for this roomname
		newroom := newRoom(requestRoom)
		room = &newroom
		rooms[requestRoom] = room
		// start new goroutine for handling broadcast to clients
		go handleMessages(room)
	}

	// add client to room
	room.clients[ws] = true

	for {
		var msg Message
		// Read in a new message as JSON and map to a Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error reading message: %v", err)
			delete(room.clients, ws)
			break
		}
		log.Println(msg.Message)
		// Send the newly received message to the broadcast channel
		room.broadcast <- msg
	}
}

func handleMessages(room *Room) {
	for {
		// Grab next message from our broadcast channel queue
		msg := <-room.broadcast
		// Now send it to every connected client
		for client := range room.clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error writing to client: %v", err)
				client.Close()
				delete(room.clients, client)
			}
		}
	}
}
