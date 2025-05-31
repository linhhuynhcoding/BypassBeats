package consumers

import (
	"context"
	"encoding/json"
	"log"
	"song-service/models"

	"github.com/segmentio/kafka-go"
	"gorm.io/gorm"
)

func StartSongReadyConsumer(db *gorm.DB, broker string) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{broker},
		Topic:   "processor.song-ready",
		GroupID: "song-service",
	})

	go func() {
		for {
			m, err := r.ReadMessage(context.Background())
			if err != nil {
				log.Println("Kafka error:", err)
				continue
			}
			var song models.Song
			if err := json.Unmarshal(m.Value, &song); err != nil {
				log.Println("Invalid message format:", err)
				continue
			}
			db.Create(&song)
			log.Println("Song saved from Kafka:", song.Title)
		}
	}()
}
