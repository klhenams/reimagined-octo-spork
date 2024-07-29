package services

import (
	"cashapp/core"
	"cashapp/core/currency"
	"errors"

	"cashapp/core/processor"

	"cashapp/models"
	"cashapp/repository"
)

type paymentLayer struct {
	repository repository.Repo
	config     *core.Config
	processor  processor.Processor
}

func newPaymentLayer(r repository.Repo, c *core.Config) *paymentLayer {
	return &paymentLayer{
		repository: r,
		config:     c,
		processor:  processor.New(r),
	}
}

func (p *paymentLayer) SendMoney(req core.CreatePaymentRequest) core.Response {
	fromTrans := models.Transaction{
		From:        req.From,
		To:          req.To,
		Ref:         core.GenerateRef(),
		Amount:      currency.ConvertCedisToPessewas(req.Amount),
		Description: req.Description,
		Direction:   models.Outgoing,
		Status:      models.Pending,
		Purpose:     models.Transfer,
	}

	if err := p.processor.ProcessTransaction(fromTrans); err != nil {
		p.processor.FailureCallback(&fromTrans, err)
		return core.Error(err, nil)
	}

	p.processor.SuccessCallback(&fromTrans)
	return core.Success(nil, nil)
}

func (p *paymentLayer) GetAllTransactions(offset, limit int) core.Response {
	transactions, total, err := p.processor.Repo.Transactions.GetTransactions(offset, limit)
	if err != nil {
		return core.Error(err, nil)
	}

	data := map[string]interface{}{
		"transactions": transactions,
		"total":        total,
	}

	return core.Success(&data, nil)
}

func (p *paymentLayer) GetAllTransactionEvents(offset, limit int) core.Response {
	events, total, err := p.processor.Repo.TransactionEvents.GetTransactionEvents(offset, limit)
	if err != nil {
		return core.Error(err, nil)
	}
	data := map[string]interface{}{
		"events": events,
		"total":  total,
	}

	return core.Success(&data, nil)
}

func (p *paymentLayer) GetTransactionByID(id uint) core.Response {
	transaction, err := p.processor.Repo.Transactions.GetTransactionByID(id)
	if err != nil {
		return core.Error(err, nil)
	}
	if transaction == nil {
		return core.ErrorNotFound(errors.New("transaction not found"), nil)
	}

	data := map[string]interface{}{
		"transaction": transaction,
	}

	return core.Success(&data, nil)
}

func (p *paymentLayer) GetTransactionEventByID(id uint) core.Response {
	event, err := p.processor.Repo.TransactionEvents.GetTransactionEventByID(id)
	if err != nil {
		return core.Error(err, nil)
	}
	if event == nil {
		return core.ErrorNotFound(errors.New("transaction event not found"), nil)
	}

	data := map[string]interface{}{
		"event": event,
	}

	return core.Success(&data, nil)
}
