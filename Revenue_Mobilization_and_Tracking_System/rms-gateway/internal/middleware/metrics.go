package middleware

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gsk-fyp/rms-gateway/internal/metrics"
)

func MetricsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		duration := time.Since(start)
		status := strconv.Itoa(c.Writer.Status())

		metrics.RequestsTotal.WithLabelValues(c.Request.Method, c.FullPath(), status).Inc()
		metrics.RequestDuration.WithLabelValues(c.Request.Method, c.FullPath()).Observe(duration.Seconds())
	}
}
