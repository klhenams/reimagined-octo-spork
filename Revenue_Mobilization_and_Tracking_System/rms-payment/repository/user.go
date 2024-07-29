package repository

import (
	"cashapp/models"

	"gorm.io/gorm"
)

type userLayer struct {
	db *gorm.DB
}

func newUserLayer(db *gorm.DB) *userLayer {
	return &userLayer{
		db: db,
	}
}

func (ul *userLayer) Create(user *models.User) error {
	if err := ul.db.Create(user).Error; err != nil {
		return err
	}
	return nil

}

func (ul *userLayer) FindById(id uint) (*models.User, error) {
	user := models.User{}
	if err := ul.db.First(&user, id).Error; err != nil {
		return &user, err
	}
	return &user, nil
}

func (ul *userLayer) FindByTag(tag string) (*models.User, error) {
	user := models.User{Tag: tag}
	if err := ul.db.Where("tag = ?", tag).First(&user).Error; err != nil {
		return &user, err
	}
	return &user, nil
}

func (ul *userLayer) FindAll(offset, limit int) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	if err := ul.db.Model(&models.User{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	result := ul.db.Order("created_at DESC").Offset(offset).Limit(limit).Find(&users)
	if result.Error != nil {
		return nil, 0, result.Error
	}

	return users, total, nil
}
