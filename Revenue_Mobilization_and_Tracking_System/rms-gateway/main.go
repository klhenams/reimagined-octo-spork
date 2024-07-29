package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/gsk-fyp/rms-gateway/core/controllers"
	"github.com/gsk-fyp/rms-gateway/core/services"
	"github.com/gsk-fyp/rms-gateway/internal/config"
	"github.com/gsk-fyp/rms-gateway/internal/middleware"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"golang.org/x/time/rate"
)

func main() {
	cfg := config.NewConfig()

	router := gin.Default()

	router.Use(middleware.MetricsMiddleware())
	router.Use(gin.Recovery()) // Gin's built-in recovery middleware

	// Prometheus metrics endpoint
	router.GET("/metrics", gin.WrapH(promhttp.Handler()))

	// Create a rate limiter: 5 requests per second with burst of 10
	rateLimiter := middleware.NewRateLimiter(rate.Limit(5), 10)

	// Apply rate limiting middleware
	router.Use(rateLimiter.RateLimit())

	services := services.Setup()
	controllers.SetupRoutes(router, services)

	log.Printf("Starting server on :%s", cfg.PORT)
	router.Run(":" + cfg.PORT)
}
