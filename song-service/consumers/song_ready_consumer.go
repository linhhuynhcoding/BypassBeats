package consumers

import (
	"context"
	"encoding/json"
	"log"
	"song-service/models"

	"github.com/segmentio/kafka-go"
	"gorm.io/gorm"
)

type SongConvertedMessage struct {
	ID    string `json:"id"`
	Title string `json:"title"`
}

func StartSongReadyConsumer(db *gorm.DB, broker string) {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{broker},
		Topic:   "song.converted",
		GroupID: "song-service",
	})

	go func() {
		for {
			m, err := r.ReadMessage(context.Background())
			if err != nil {
				log.Println("Kafka read error:", err)
				continue
			}

			var msg SongConvertedMessage
			if err := json.Unmarshal(m.Value, &msg); err != nil {
				log.Println("Invalid message:", err)
				continue
			}

			song := models.Song{
				ID:    msg.ID,
				Title: msg.Title,
			}
			if err := db.Create(&song).Error; err != nil {
				log.Println("DB insert failed:", err)
			} else {
				log.Println("Song saved:", song.ID)
			}
		}
	}()
}
