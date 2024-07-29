package services

import (
	"cashapp/core"
	"cashapp/repository"
	"errors"

	"gorm.io/gorm"
)

type userLayer struct {
	repository repository.Repo
	config     *core.Config
}

func newUserLayer(r repository.Repo, c *core.Config) *userLayer {
	return &userLayer{
		repository: r,
		config:     c,
	}
}

func (c *userLayer) CreateUser(req core.CreateUserRequest) core.Response {
	user, err := c.repository.Users.FindByTag(req.Tag)

	if err == nil {
		return core.Error(err, core.String("cash tag has already been taken"))
	}

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return core.Error(err, nil)
	}

	if err := c.repository.Users.Create(user); err != nil {
		return core.Error(err, nil)
	}

	return core.Success(&map[string]interface{}{
		"user": user,
	}, core.String("user created successfully"))

}

func (c *userLayer) GetUser(tag string) core.Response {
	user, err := c.repository.Users.FindByTag(tag)

	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return core.ErrorNotFound(err, nil)
	}

	if err != nil {
		return core.Error(err, nil)
	}

	data := map[string]interface{}{
		"user": user,
	}

	return core.Success(&data, nil)
}

func (c *userLayer) GetUsers(offset, limit int) core.Response {
	users, total, err := c.repository.Users.FindAll(offset, limit)

	if err != nil {
		return core.Error(err, nil)
	}

	data := map[string]interface{}{
		"users": users,
		"total": total,
	}

	return core.Success(&data, nil)
}
