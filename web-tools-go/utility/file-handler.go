package utility

import (
	"hash/fnv"
	"image"
	"image/png"
	"os"
	"strconv"
)

func Hash(s string) string {
	h := fnv.New32a()
	h.Write([]byte(s))
	return strconv.FormatUint(uint64(h.Sum32()), 10)
}

func SaveImage(img image.Image) {
	f, err := os.Create("temp/image.png")
	if err != nil {
		panic(err)
	}

	defer f.Close()

	png.Encode(f, img)
}
