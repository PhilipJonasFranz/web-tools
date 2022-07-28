package utility

import (
	"image"
	"image/color"
)

func InvertImage(img image.Image) image.Image {
	invertedImage := image.NewRGBA(img.Bounds())

	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			R, G, B, A := img.At(x, y).RGBA()
			transparentPix := color.RGBA{uint8(255 - R), uint8(255 - G), uint8(255 - B), uint8(A)}
			invertedImage.Set(x, y, transparentPix)
		}
	}

	return invertedImage
}
