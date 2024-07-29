package main

import (
	"file-server/internal/database"
	"file-server/pkg/config"
	"fmt"
	"log"

	"file-server/api/models"
	"file-server/api/routes"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

var db *gorm.DB = database.GetDatabaseConnection()

func main() {
	err := db.AutoMigrate(&models.File{})
	if err != nil {
		log.Fatal(err)
	}

	r := gin.Default()

	v1 := r.Group("")
	{
		routes.FileRoutes(v1)
	}

	r.Run(fmt.Sprintf(":%s", config.ENV.ServerPort))
}
