package services

import (
	"song-service/models"
	"song-service/repository"

	"gorm.io/gorm"
)

func CreatePlaylist(db *gorm.DB, playlist *models.Playlist) error {
	return repository.CreatePlaylist(db, playlist)
}

func GetPlaylistsByUser(db *gorm.DB, userId string) ([]models.Playlist, error) {
	return repository.GetPlaylistsByUser(db, userId)
}
