package core

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
	PG_HOST        string
	PG_PORT        string
	PG_NAME        string
	PG_USER        string
	PG_PASS        string
	PG_SSLMODE     string
	REDIS_ADDRESS  string
	REDIS_PASSWORD string
	REDIS_DB       int
	REDIS_URL      string
	DATABASE_URL   string
	PORT           int
	RUN_SEEDS      bool
	ENVIRONMENT    Environment
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
		PG_HOST:        os.Getenv("PG_HOST"),
		PG_PORT:        os.Getenv("PG_PORT"),
		PG_NAME:        os.Getenv("PG_NAME"),
		PG_USER:        os.Getenv("PG_USER"),
		PG_PASS:        os.Getenv("PG_PASS"),
		PG_SSLMODE:     os.Getenv("PG_SSLMODE"),
		REDIS_ADDRESS:  os.Getenv("REDIS_ADDRESS"),
		REDIS_PASSWORD: os.Getenv("REDIS_PASSWORD"),
		REDIS_DB:       GetInt("REDIS_DB", 0),
		REDIS_URL:      os.Getenv("REDIS_URL"),
		DATABASE_URL:   os.Getenv("DATABASE_URL"),
		PORT:           GetInt("PORT", 9001),
		ENVIRONMENT:    GetEnvironment(),
		RUN_SEEDS:      os.Getenv("RUN_SEEDS") == "true",
	}
}
