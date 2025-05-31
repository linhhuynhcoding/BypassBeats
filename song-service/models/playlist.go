package models

type Playlist struct {
	ID       string `gorm:"primaryKey" json:"id"`
	UserId   string `json:"user_id"`
	Name     string `json:"name"`
	IsPublic bool   `json:"is_public"`
}
