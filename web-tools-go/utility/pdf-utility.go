package utility

import (
	"github.com/pdfcpu/pdfcpu/pkg/api"
)

func MergeFiles(files []string, outname string) {
	err := api.MergeCreateFile(files, outname, nil)
	if err != nil {
		panic(err)
	}
}

func ValidatePDF(file string) bool {
	return api.ValidateFile(file, nil) == nil
}
