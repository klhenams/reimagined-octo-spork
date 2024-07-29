package models

import (
	"errors"
	"log"
	"time"

	"gorm.io/gorm"
)

type Type string
type Status string
type Direction string
type Purpose string

var (
	Debit  Type = "debit"
	Credit Type = "credit"

	Failed  Status = "failed"
	Pending Status = "pending"
	Success Status = "success"

	Incoming Direction = "incoming"
	Outgoing Direction = "outgoing"

	Transfer   Purpose = "transfer"
	Deposit    Purpose = "deposit"
	Withdrawal Purpose = "withdrawal"
	Reversal   Purpose = "reversal"
)

type Model struct {
	ID        int       `gorm:"primary_key" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type User struct {
	Model
	Tag string `json:"tag"`
	// add other necessary information we need from the database
}

type Transaction struct {
	Model
	FailureReason     string             `json:"failure_reason"`
	Direction         Direction          `json:"direction"`
	Status            Status             `json:"status"`
	Description       string             `json:"description"`
	Ref               string             `json:"ref"`
	From              int                `json:"from"`
	To                int                `json:"to"`
	Amount            int64              `json:"amount"`
	Purpose           Purpose            `json:"purpose"`
	TransactionEvents []TransactionEvent `json:"transaction_events"`
}

type TransactionEvent struct {
	Model
	TransactionID int   `json:"transaction_id"`
	Type          Type  `json:"type"`
	Amount        int64 `json:"amount"`
}

func RunSeeds(db *gorm.DB) {
	user := User{
		Tag: "yaw",
	}

	if err := db.Model(&User{}).Where("tag=?", user.Tag).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			db.Create(&user)
		} else {
			log.Println("err is nil", err)
		}
	}
}
