package routes

import (
	"cashapp/core"
	"cashapp/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(e *gin.Engine, s services.Services) {
	e.POST("/p/users/create", func(c *gin.Context) {

		var req core.CreateUserRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": err.Error(),
			})
			return
		}

		response := s.Users.CreateUser(req)

		if response.Error {
			c.JSON(response.Code, gin.H{
				"message": response.Meta.Message,
			})
			return
		}

		c.JSON(response.Code, response.Meta)
	})

	e.GET("/p/users/:tag", func(c *gin.Context) {
		tag := c.Param("tag")

		response := s.Users.GetUser(tag)

		if response.Error {
			c.JSON(response.Code, gin.H{
				"message": response.Meta.Message,
			})
			return
		}

		c.JSON(response.Code, response.Meta)
	})

	e.GET("/p/users", func(c *gin.Context) {
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

		response := s.Users.GetUsers(offset, limit)
		if response.Error {
			c.JSON(response.Code, gin.H{
				"message": response.Meta.Message,
			})
			return
		}

		c.JSON(response.Code, response.Meta)
	})
}
