package routes

import (
	"file-server/api/controllers"

	"github.com/gin-gonic/gin"
)

func FileRoutes(r *gin.RouterGroup) {
	fileRoutes := r.Group("/file")

	fileRoutes.POST("/upload", controllers.UploadHandler)
	fileRoutes.GET("/download/:shortLink", controllers.DownloadHandler)
}
