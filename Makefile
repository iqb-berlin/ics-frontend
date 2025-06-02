run:
	docker compose -f docker-compose.yml up

up:
	docker compose -f docker-compose.yml up -d

down:
	docker compose -f docker-compose.yml up

logs:
	docker compose -f docker-compose.yml logs -f $(SERVICE)

run-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.ics-is up

up-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.ics-is up -d

down-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.ics-is down

logs-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.ics-is logs

include .env.ics-frontend
push-iqb-registry:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.ics-frontend build
	docker login scm.cms.hu-berlin.de:4567
	docker push $(REGISTRY_PATH)ics-frontend:$(TAG)
	docker logout
