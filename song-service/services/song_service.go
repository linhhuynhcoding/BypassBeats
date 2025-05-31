package services

import (
	"song-service/models"
	"song-service/repository"

	"gorm.io/gorm"
)

func CreateSong(db *gorm.DB, song *models.Song) error {
	return repository.SaveSong(db, song)
}

func GetSongs(db *gorm.DB) ([]models.Song, error) {
	return repository.GetAllSongs(db)
}
