package routes

import (
	"cashapp/core"
	"cashapp/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func RegisterPaymentRoutes(e *gin.Engine, s services.Services) {
	e.POST("/p/pay", func(c *gin.Context) {
		var req core.CreatePaymentRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": err.Error(),
			})
			return
		}

		response := s.Payments.SendMoney(req)
		if response.Error {
			c.JSON(response.Code, gin.H{
				"message": response.Meta.Message,
			})
			return
		}

		c.JSON(response.Code, response.Meta)
	})

	e.GET("/p/transactions", func(c *gin.Context) {
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

		response := s.Payments.GetAllTransactions(offset, limit)
		if response.Error {
			c.JSON(response.Code, response.Meta)
			return
		}

		c.JSON(response.Code, response.Meta)
	})

	e.GET("/p/events", func(c *gin.Context) {
		offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
		limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

		response := s.Payments.GetAllTransactionEvents(offset, limit)
		if response.Error {
			c.JSON(response.Code, response.Meta)
			return
		}

		c.JSON(response.Code, response.Meta)
	})

	e.GET("/p/transaction/:id", func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid payment ID",
			})
			return
		}

		response := s.Payments.GetTransactionByID(uint(id))
		if response.Error {
			c.JSON(response.Code, response.Meta)
			return
		}

		c.JSON(response.Code, response.Meta)
	})

	e.GET("/p/events/:id", func(c *gin.Context) {
		id, err := strconv.ParseUint(c.Param("id"), 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"message": "Invalid payment event ID",
			})
			return
		}

		response := s.Payments.GetTransactionEventByID(uint(id))
		if response.Error {
			c.JSON(response.Code, response.Meta)
			return
		}

		c.JSON(response.Code, response.Meta)
	})
}
