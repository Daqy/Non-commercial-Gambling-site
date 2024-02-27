package shared

type Click struct {
	Position int     `bson:"position,omitempty" json:"position,omitempty"`
	Earned   float64 `bson:"earned,omitempty" json:"earned,omitempty"`
}
