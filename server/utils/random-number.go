package utils

import "math/rand"

func RandomNumberGenerator(min int, max int) int {
	return rand.Intn(max-min) + min
}
