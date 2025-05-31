package repository

import (
	"song-service/models"

	"gorm.io/gorm"
)

func CreatePlaylist(db *gorm.DB, playlist *models.Playlist) error {
	return db.Create(playlist).Error
}

func GetPlaylistsByUser(db *gorm.DB, userId string) ([]models.Playlist, error) {
	var playlists []models.Playlist
	err := db.Where("user_id = ?", userId).Find(&playlists).Error
	return playlists, err
}
