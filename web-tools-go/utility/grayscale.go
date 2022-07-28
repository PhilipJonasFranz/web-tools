package utility

import (
	"image"
	"image/color"
)

func GrayscaleImage(img image.Image) image.Image {
	grayImg := image.NewGray(img.Bounds())
	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			R, G, B, _ := img.At(x, y).RGBA()
			//Luma: Y = 0.2126*R + 0.7152*G + 0.0722*B
			Y := (0.2126*float64(R) + 0.7152*float64(G) + 0.0722*float64(B)) * (255.0 / 65535)
			grayPix := color.Gray{uint8(Y)}
			grayImg.Set(x, y, grayPix)
		}
	}

	return grayImg
}
