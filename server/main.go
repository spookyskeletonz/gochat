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
	fs := http.FileServer(http.Dir("../client"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", handleConnections)

	// go routine that takes messages from broadcast and passes to clients
	go handleMessages()

	log.Println("http server starting on :8000")
	err := http.ListenAndServe(":8000", nil)
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
		room = newRoom(requestRoom)
		rooms[requestRoom] = room
		room.clients[ws] = true
	}

	for {
		var msg Message
		// Read in a new message as JSON and map to a Message
		err := ws.ReadJSON(&msg)
		log.Println("new message!")
		if err != nil {
			log.Printf("error reading message: %v", err)
			delete(room.clients, ws)
			break
		}
		log.Println(msg.Message)
		// Send the newly received message to the broadcast channel
		room.broadcast <- msg
		log.Println("sending message to clients")
	}
}

func handleMessages() {
	for {
		for room := range rooms {
			// Grab next message from our broadcast channel queue
			msg := <-room.broadcast
			// Now send it to every connected client
			for client := range room.clients {
				err := client.WriteJSON(msg)
				log.Println("writing message to client")
				if err != nil {
					log.Printf("error writing to client: %v", err)
					client.Close()
					delete(clients, client)
				}
			}
		}
	}
}
