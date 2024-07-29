package repository

import (
	"gorm.io/gorm"
)

type Repo struct {
	Users             *userLayer
	Transactions      *transactionLayer
	Provider          *providerLayer
	TransactionEvents *eventLayer
}

func NewRepository(db *gorm.DB) Repo {
	return Repo{
		Users:             newUserLayer(db),
		Transactions:      newTransactionLayer(db),
		Provider:          newProviderLayer(db),
		TransactionEvents: newEventLayer(db),
	}
}
