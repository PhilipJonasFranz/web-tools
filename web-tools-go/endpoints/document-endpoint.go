package endpoints

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"service/web-tools-go/utility"

	"github.com/gin-gonic/gin"
)

func ProcessDocument(c *gin.Context) {
	var recMessage ServiceRequest

	if err := c.BindJSON(&recMessage); err != nil {
		return
	}

	var inputs = make([]string, len(recMessage.Files))

	fileDescriptors := ""

	/* Decode files and store them as temporary files. The returned file descriptors are used to identify them. */
	for i := 0; i < len(recMessage.Files); i++ {
		fileDescriptor := utility.DecodaDocumentAndSaveToFile(recMessage.Files[i])
		fileDescriptors += fileDescriptor
		inputs[i] = "cache/" + fileDescriptor + ".pdf"
	}

	/* Determine safe name for resulting file */
	outFileHash := utility.Hash(fileDescriptors)
	targetPath := "cache/merge-" + outFileHash + ".pdf"

	if _, err := os.Stat(targetPath); errors.Is(err, os.ErrNotExist) {
		retryCnt := 0
		for {
			if recMessage.ID == "merge" {
				utility.MergeFiles(inputs, targetPath)
			}

			if utility.ValidatePDF(targetPath) {
				break
			} else {
				retryCnt++
				if retryCnt == 5 {
					c.IndentedJSON(http.StatusInternalServerError, recMessage)
					fmt.Println("[WEB-TOOLS] Failed to merge PDF documents!")
					return
				}
			}
		}
	}

	c.Header("Content-Description", "File Transfer")
	c.Header("Content-Transfer-Encoding", "binary")
	c.Header("Content-Disposition", "attachment; filename="+outFileHash+".pdf")
	c.Header("Content-Type", "application/octet-stream")
	c.File(targetPath)
}
