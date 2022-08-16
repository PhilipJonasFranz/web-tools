package endpoints

import (
	"fmt"
	"net/http"
	"service/web-tools-go/utility"
	"strconv"

	"github.com/gin-gonic/gin"
)

func ProcessDocument(c *gin.Context) {
	var recMessage ServiceRequest

	if err := c.BindJSON(&recMessage); err != nil {
		return
	}

	var inputs = make([]string, len(recMessage.Files))

	fileDescriptors := ""
	filetype := "pdf"
	if recMessage.ID == "image-to-pdf" {
		filetype = "png"
	}

	/* Decode files and store them as temporary files. The returned file descriptors are used to identify them. */
	for i := 0; i < len(recMessage.Files); i++ {
		fileDescriptor := utility.DecodeFileAndSaveToFile(recMessage.Files[i], filetype)
		fileDescriptors += fileDescriptor
		inputs[i] = "cache/" + fileDescriptor + "." + filetype
	}

	/* Determine safe name for resulting file */
	outFileHash := utility.Hash(fileDescriptors)
	targetPath := "cache/" + recMessage.ID + "-" + outFileHash + ".pdf"

	retryCnt := 0
	for {
		if recMessage.ID == "merge" {
			utility.MergeFiles(inputs, targetPath)
		} else if recMessage.ID == "rotate" {
			rotation, _ := strconv.Atoi(recMessage.Args[0])
			utility.RotateFile(inputs[0], targetPath, rotation)
		} else if recMessage.ID == "image-to-pdf" {
			utility.ImageToPDF(inputs, targetPath)
		}

		if utility.ValidatePDF(targetPath) {
			break
		} else {
			retryCnt++
			if retryCnt == 5 {
				c.IndentedJSON(http.StatusInternalServerError, recMessage)
				fmt.Println("[WEB-TOOLS] Failed to " + recMessage.ID + " PDF documents!")
				return
			}
		}
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename="+outFileHash+".pdf")
	c.Header("Content-Type", "application/octet-stream")
	c.File(targetPath)
}
