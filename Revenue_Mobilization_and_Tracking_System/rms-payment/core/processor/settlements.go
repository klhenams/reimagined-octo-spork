package processor

import (
	"cashapp/core/currency"
	"cashapp/models"

	"fmt"

	"gorm.io/gorm"
)

func (p *Processor) DepositMoneyToProvider(fromTrans models.Transaction) error {
	// Assume we have a service to interact with the payment provider
	providerService := p.Repo.Provider

	// Request deposit from the payment provider
	depositResult, err := providerService.RequestDeposit(fromTrans.From, fromTrans.Amount)
	if err != nil {
		return fmt.Errorf("failed to request deposit from provider: %v", err)
	}

	// Create a transaction record
	toTrans := models.Transaction{
		From:        fromTrans.From,
		To:          fromTrans.To,
		Ref:         depositResult.ProviderReference, // Use reference from provider
		Amount:      currency.ConvertCedisToPessewas(fromTrans.Amount),
		Description: fromTrans.Description,
		Direction:   models.Incoming,
		Status:      models.Pending,
		Purpose:     models.Deposit,
	}

	err = p.Repo.Transactions.SQLTransaction(func(tx *gorm.DB) error {
		if err := p.Repo.Transactions.Create(tx, &toTrans); err != nil {
			return fmt.Errorf("failed to create deposit transaction record: %v", err)
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("deposit failed: %v", err)
	}

	return nil
}

func (p *Processor) WithdrawMoneyFromProvider(fromTrans models.Transaction) error {
	providerService := p.Repo.Provider

	// Request withdrawal from the payment provider
	withdrawalResult, err := providerService.RequestWithdrawal(fromTrans.From, fromTrans.Amount)
	if err != nil {
		return fmt.Errorf("failed to request withdrawal from provider: %v", err)
	}

	// Create a transaction record
	fromTrans.Amount = currency.ConvertCedisToPessewas(fromTrans.Amount)
	fromTrans.Direction = models.Outgoing
	fromTrans.Status = models.Pending
	fromTrans.Purpose = models.Withdrawal
	fromTrans.Ref = withdrawalResult.ProviderReference // Use reference from provider

	err = p.Repo.Transactions.SQLTransaction(func(tx *gorm.DB) error {
		if err := p.Repo.Transactions.Create(tx, &fromTrans); err != nil {
			return fmt.Errorf("failed to create withdrawal transaction record: %v", err)
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("withdrawal failed: %v", err)
	}

	return nil
}
