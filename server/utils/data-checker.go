package utils

func ValueInArray[T comparable](array []T, value T) bool {
	for _, item := range array {
		if value == item {
			return true
		}
	}
	return false
}
