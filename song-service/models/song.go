package models

type Song struct {
	ID         string   `gorm:"primaryKey" json:"id"`
	Title      string   `json:"title"`
	Artist     string   `json:"artist"`
	VideoId    string   `json:"video_id"`
	TitleToken []string `gorm:"type:text[]" json:"title_token"`
	Categories []string `gorm:"type:text[]" json:"categories"`
}
