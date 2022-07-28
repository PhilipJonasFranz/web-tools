package utility

import (
	"bytes"
	"encoding/base64"
	"errors"
	"fmt"
	"image"
	"image/png"
	"os"
	"strings"
	"time"
)

func DecodaDocumentAndSaveToFile(rawData string) string {
	/* Cut off prefix "data:application/pdf;base64," */
	rawData = rawData[strings.IndexByte(rawData, ',')+1:]

	/* Create hash value as name for the file */
	dataHash := Hash(rawData)

	/* Construct filepath for document in cache */
	targetPath := "cache/" + dataHash + ".pdf"

	if _, err := os.Stat(targetPath); errors.Is(err, os.ErrNotExist) {
		/*
		 * We only have to decode and save the file if it does
		 * not already exist.
		 */
		dec, err := base64.StdEncoding.DecodeString(rawData)
		if err != nil {
			panic(err)
		}

		f, err := os.Create(targetPath)
		if err != nil {
			panic(err)
		}
		defer f.Close()

		if _, err := f.Write(dec); err != nil {
			panic(err)
		}
		if err := f.Sync(); err != nil {
			panic(err)
		}
	} else {
		/*
		 * If the file already exists we have to update the last modified date
		 * to now to prevent premature deletion
		 */
		currenttime := time.Now().Local()
		err = os.Chtimes(targetPath, currenttime, currenttime)

		if err != nil {
			panic(err)
		}
	}

	/* Returns hash value to identify the file later */
	return dataHash
}

func DecodeToPNG(rawImage string) image.Image {
	/* Cut off prefix "data:image/png;base64," */
	rawImage = rawImage[strings.IndexByte(rawImage, ',')+1:]

	/* Decode the base64 string to a byte[] */
	unbased, err := base64.StdEncoding.DecodeString(string(rawImage))
	if err != nil {
		fmt.Println("Failed to decode string from base64: ")
		fmt.Println(err)
	}

	/* Decode a PNG image from the byte[] */
	pngI, err := png.Decode(bytes.NewReader(unbased))
	if err != nil {
		fmt.Println("Failed to decode PNG image from byte[]: ")
		fmt.Println(err)
	}

	return pngI
}

func EncodePNG(pngI image.Image) string {
	var base64Encoding string

	/* Add prefix */
	base64Encoding += "data:image/png;base64,"

	/* Encode image to byte[] */
	buf := new(bytes.Buffer)
	err := png.Encode(buf, pngI)
	if err != nil {
		fmt.Println("Failed to encode image to byte[]: ")
		fmt.Println(err)
	}

	/* Obtain base64 encoding of byte[] and append to result */
	base64Encoding += base64.StdEncoding.EncodeToString(buf.Bytes())

	return base64Encoding
}
