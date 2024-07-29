package config

import (
	"log"
	"os"
	"strconv"
)

type Environment string

const (
	Development Environment = "dev"
	Staging     Environment = "staging"
)

type Config struct {
	PAYMENT     string
	FILE        string
	MANAGEMENT  string
	PORT        string
	ENVIRONMENT Environment
}

func Get(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func GetInt(key string, fallback int) int {
	if v := os.Getenv(key); v != "" {
		i, err := strconv.Atoi(v)
		if err != nil {
			log.Printf("%s: %s", key, err)
			return fallback
		}
		return i
	}
	return fallback
}

func GetEnvironment() Environment {
	if env := Get("ENV", ""); env == "" {
		return Development
	} else {
		return Environment(env)
	}
}

func NewConfig() *Config {
	return &Config{
		FILE:        os.Getenv("FILE"),
		MANAGEMENT:  os.Getenv("MANAGEMENT"),
		PAYMENT:     os.Getenv("PAYMENT"),
		PORT:        os.Getenv("PORT"),
		ENVIRONMENT: GetEnvironment(),
	}
}
