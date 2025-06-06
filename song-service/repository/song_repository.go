package repository

import (
	"song-service/models"

	"gorm.io/gorm"
)

func GetAllSongs(db *gorm.DB) ([]models.Song, error) {
	var songs []models.Song
	err := db.Find(&songs).Error
	return songs, err
}

func GetSongById(db *gorm.DB, id string) (models.Song, error) {
	var song models.Song
	err := db.First(&song, "id = ?", id).Error
	return song, err
}

func SaveSong(db *gorm.DB, song *models.Song) error {
	return db.Create(song).Error
}
