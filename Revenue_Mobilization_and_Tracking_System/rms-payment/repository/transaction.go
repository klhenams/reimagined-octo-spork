package repository

import (
	"cashapp/models"
	"errors"

	"gorm.io/gorm"
)

type transactionLayer struct {
	db *gorm.DB
}

func newTransactionLayer(db *gorm.DB) *transactionLayer {
	return &transactionLayer{
		db: db,
	}
}

func (tl *transactionLayer) SQLTransaction(f func(tx *gorm.DB) error) error {
	return tl.db.Transaction(f)
}

func (tl *transactionLayer) Create(tx *gorm.DB, data *models.Transaction) error {
	if err := tx.Create(data).Error; err != nil {
		return err
	}
	return nil
}

func (tl *transactionLayer) Updates(tx *gorm.DB, transactions ...*models.Transaction) error {
	for _, trans := range transactions {
		if err := tx.Updates(trans).Error; err != nil {
			return err
		}
	}
	return nil
}

func (tl *transactionLayer) GetTransactions(offset, limit int) ([]models.Transaction, int64, error) {
	var transactions []models.Transaction
	var total int64

	if err := tl.db.Model(&models.Transaction{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	result := tl.db.Order("created_at DESC").Offset(offset).Limit(limit).Find(&transactions)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return transactions, total, nil
}

func (tl *transactionLayer) GetTransactionByID(id uint) (*models.Transaction, error) {
	var transaction models.Transaction
	result := tl.db.First(&transaction, id)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil // Return nil if no transaction is found
		}
		return nil, result.Error
	}
	return &transaction, nil
}
