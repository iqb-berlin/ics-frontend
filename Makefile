run:
	docker compose up

run-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.ics-frontend up

down-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml down

build-prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml build


# Push all docker images to 'scm.cms.hu-berlin.de:4567/iqb/studio-lite'
include .env.ics-frontend
push-iqb-registry:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.ics-frontend build
	docker login scm.cms.hu-berlin.de:4567
	docker push $(REGISTRY_PATH)ics-frontend:$(TAG)
	docker logout
