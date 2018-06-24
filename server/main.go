package main

import (
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

/* some global variables
 * clients is a set of clients (implemented by hashmap with bool values)
 * broadcast is a messsage queue implemented as a channel as it will communicate between goroutines
 */
var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)

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
	// upgrade GET request to websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("upgrade request: ", err)
	}

	// Make sure we close the connection when the function returns.
	// defers close to whenever the function is returned
	defer ws.Close()

	// Register new client to clients
	clients[ws] = true

	for {
		var msg Message
		// Read in a new message as JSON and map to a Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error reading message: %v", err)
			delete(clients, ws)
			break
		}
		// Send the newly received message to the broadcast channel
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		// Grab next message from our broadcast channel queue
		msg := <-broadcast
		// Now send it to every connected client
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error writing to client: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
