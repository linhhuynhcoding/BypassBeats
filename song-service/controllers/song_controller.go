package controllers

import (
	"net/http"
	"song-service/models"
	"song-service/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetSongsHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		songs, err := services.GetSongs(db)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, songs)
	}
}

func CreateSongHandler(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var song models.Song
		if err := c.ShouldBindJSON(&song); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		// song.UserID = c.GetString("userId")
		// if err := services.CreateSong(db, &song); err != nil {
		// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		// 	return
		// }
		c.JSON(http.StatusCreated, song)
	}
}
