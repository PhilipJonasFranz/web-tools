package main

import (
	"github.com/gin-gonic/gin"

	"service/web-tools-go/endpoints"
	"service/web-tools-go/utility"

	cors "github.com/rs/cors/wrapper/gin"
)

func main() {
	/* Setup cache cleanup */
	utility.SetupCacheCleanup()

	router := gin.Default()
	router.Use(cors.Default())

	/* Register API endpoints */
	router.POST("image", endpoints.ProcessImage)
	router.POST("document", endpoints.ProcessDocument)

	router.Run("localhost:8081")
}
