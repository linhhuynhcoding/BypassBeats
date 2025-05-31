package routes

import (
	"song-service/controllers"
	"song-service/middleware"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func RegisterRoutes(router *gin.Engine, db *gorm.DB) {
	router.Use(middleware.UserContextMiddleware())

	songGroup := router.Group("/songs")
	{
		songGroup.GET("", controllers.GetSongsHandler(db))
		songGroup.POST("", controllers.CreateSongHandler(db))
	}

	playlistGroup := router.Group("/playlists")
	{
		playlistGroup.POST("", controllers.CreatePlaylistHandler(db))
		playlistGroup.GET("", controllers.GetUserPlaylistsHandler(db))
	}
}
