package utility

import (
	"image"
	"image/color"
	"math"
)

func AddTransparencyToImage(img image.Image, col color.Color, similarity int) image.Image {
	transparentImage := image.NewRGBA(img.Bounds())

	uRX, uGX, uBX, _ := col.RGBA()

	/* Convert from scaled uint32s */
	RX := int(uRX >> 8)
	GX := int(uGX >> 8)
	BX := int(uBX >> 8)

	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
			uR, uG, uB, A := img.At(x, y).RGBA()

			/* Convert from scaled uint32s */
			R := int(uR >> 8)
			G := int(uG >> 8)
			B := int(uB >> 8)

			/* Compute cosine-similarity between the two colors. Exactly equal = 1, complete opposite = 0 */
			difference := int(math.Sqrt(math.Pow(math.Abs(float64(RX-R)), 2)+math.Pow(math.Abs(float64(GX-G)), 2)+math.Pow(math.Abs(float64(BX-B)), 2)) / 4.2)

			if difference <= similarity {
				A = 0
			}

			transparentPix := color.RGBA{uint8(R), uint8(G), uint8(B), uint8(A)}
			transparentImage.Set(x, y, transparentPix)
		}
	}

	return transparentImage
}
