package middleware

import "github.com/gin-gonic/gin"

func UserContextMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userId := c.GetHeader("X-User-Id")
		if userId != "" {
			c.Set("userId", userId)
		}
		c.Next()
	}
}
