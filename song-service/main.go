package main

import (
	"log"
	"song-service/config"
	"song-service/consumers"
	"song-service/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.LoadConfig()
	consumers.StartSongReadyConsumer(cfg.DB, cfg.KafkaBroker)

	r := gin.Default()
	routes.RegisterRoutes(r, cfg.DB)

	log.Println("Listening on port:", cfg.Port)
	r.Run(":" + cfg.Port)
}
