package controllers

import (
	"net/http"
	"song-service/models"
	"song-service/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreatePlaylistHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var playlist models.Playlist
		if err := c.ShouldBindJSON(&playlist); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		playlist.UserId = c.GetString("userId")
		if err := services.CreatePlaylist(db, &playlist); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusCreated, playlist)
	}
}

func GetUserPlaylistsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetString("userId")
		playlists, err := services.GetPlaylistsByUser(db, userId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, playlists)
	}
}
