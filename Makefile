PROJECT_NAME := praam-ai

.PHONY: up down restart logs build ps prod-up prod-down prod-logs

up:
	docker compose up --build -d
	@printf "\nUI URL: http://localhost:8080\n\n"

down:
	docker compose down

restart: down up

logs:
	docker compose logs -f web

build:
	docker compose build

ps:
	docker compose ps

prod-up:
	docker compose -f docker-compose.prod.yml up --build -d
	@printf "\nProduction stack started for praamai.com\n\n"

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f
