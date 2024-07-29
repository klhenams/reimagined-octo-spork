package repository

import (
	"cashapp/models"
	"errors"

	"gorm.io/gorm"
)

type eventLayer struct {
	db *gorm.DB
}

func newEventLayer(db *gorm.DB) *eventLayer {
	return &eventLayer{
		db: db,
	}
}

func (el *eventLayer) Save(tx *gorm.DB, data *models.TransactionEvent) error {
	if err := tx.Create(data).Error; err != nil {
		return err
	}
	return nil
}

func (el *eventLayer) GetTransactionEvents(offset, limit int) ([]models.TransactionEvent, int64, error) {
	var events []models.TransactionEvent
	var total int64

	if err := el.db.Model(&models.TransactionEvent{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	result := el.db.Order("created_at DESC").Offset(offset).Limit(limit).Find(&events)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return events, total, nil
}

func (el *eventLayer) GetTransactionEventByID(id uint) (*models.TransactionEvent, error) {
	var event models.TransactionEvent
	result := el.db.First(&event, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil // Return nil if no event is found
		}
		return nil, result.Error
	}
	return &event, nil
}
