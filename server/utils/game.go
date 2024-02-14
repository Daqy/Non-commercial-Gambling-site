package utils

import "server/shared"

func GenerateBombPosition(bombCount int) []int {
	var positions []int
	for iteration := 0; iteration < bombCount; iteration++ {
		position := RandomNumberGenerator(1, 25)

		for ValueInArray(positions, position) {
			position = RandomNumberGenerator(1, 25)
		}

		positions = append(positions, position)
	}
	return positions
}

func GetPercentageOfWinningGame(size int, nextClickCount int, bombCount int) int {
	total := 1

	for iteration := 0; iteration < nextClickCount; iteration++ {
		total = total * (size - bombCount - iteration) / (size - iteration)
	}

	return total
}

func HasBeenClickedMinesweeper(pos int, clicks []shared.Click) bool {
	if len(clicks) == 0 {
		return false
	}
	for _, item := range clicks {
		if item.Position == pos {
			return true
		}
	}
	return false
}
