package main

import (
	"identity-service/config"
	"identity-service/models"
	"identity-service/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	config.InitConfig()
	config.DB.AutoMigrate(&models.User{})

	r := gin.Default()
	routes.SetupRoutes(r)

	r.Run(":8080")
}
