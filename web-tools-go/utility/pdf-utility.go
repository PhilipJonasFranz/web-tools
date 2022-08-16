package utility

import (
	"github.com/pdfcpu/pdfcpu/pkg/api"
)

func ImageToPDF(files []string, outname string) {
	err := api.ImportImagesFile(files, outname, nil, nil)
	if err != nil {
		panic(err)
	}
}

func RotateFile(file string, outname string, rotation int) {
	err := api.RotateFile(file, outname, rotation, nil, nil)
	if err != nil {
		panic(err)
	}
}

func MergeFiles(files []string, outname string) {
	err := api.MergeCreateFile(files, outname, nil)
	if err != nil {
		panic(err)
	}
}

func ValidatePDF(file string) bool {
	return api.ValidateFile(file, nil) == nil
}
