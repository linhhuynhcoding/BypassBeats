package models

type PlaylistItem struct {
	ID         string `gorm:"primaryKey" json:"id"`
	SongId     string `json:"song_id"`
	PlaylistId string `json:"playlist_id"`
	Position   int    `json:"position"`
}
