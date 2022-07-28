package endpoints

import (
	"fmt"
	"image/color"
	"net/http"
	"strconv"

	"service/web-tools-go/utility"

	"github.com/gin-gonic/gin"
)

func ProcessImage(c *gin.Context) {
	var recMessage ServiceRequest

	if err := c.BindJSON(&recMessage); err != nil {
		fmt.Println(err)
		return
	}

	for i := 0; i < len(recMessage.Files); i++ {
		pngI := utility.DecodeToPNG(recMessage.Files[i])

		if recMessage.ID == "grayscale" {
			pngI = utility.GrayscaleImage(pngI)
		} else if recMessage.ID == "invert" {
			pngI = utility.InvertImage(pngI)
		} else if recMessage.ID == "transparency" {
			R, _ := strconv.Atoi(recMessage.Args[0])
			G, _ := strconv.Atoi(recMessage.Args[1])
			B, _ := strconv.Atoi(recMessage.Args[2])

			removeColor := color.RGBA{uint8(R), uint8(G), uint8(B), uint8(0)}
			similarity, _ := strconv.Atoi(recMessage.Args[3])

			pngI = utility.AddTransparencyToImage(pngI, removeColor, similarity)
		} else {
			fmt.Println("Unknown service for endpoint 'image': " + recMessage.ID)
		}

		base64Encoding := utility.EncodePNG(pngI)
		recMessage.Files[i] = base64Encoding
	}

	c.IndentedJSON(http.StatusCreated, recMessage)
}
