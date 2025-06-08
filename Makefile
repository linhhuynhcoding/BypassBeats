postgres:
	docker run --name linh-postgres -e POSTGRES_PASSWORD=secret -e POSTGRES_USER=root -p 5432:5432 -d postgres

run-postgres:
	docker start linh-postgres

createdb:
	docker exec -it linh-postgres createdb --username=root --owner=root bypass_beats

dropdb:
	docker exec -it linh-postgres dropdb bypass_beats

run-kafka:
	docker-compose -f ./processor-service/docker-compose.yml up -d

run-song:
	cd ./song-service && go run main.go

run-fe:
	cd ./frontend && npm run dev 

run-api:
	cd ./api-gateway && npm run start:dev

run-processor:
	cd ./processor-service && npm run start:dev

run-dev: run-kafka run-processor & run-song & run-fe & run-api 

install-package:
	cd ./frontend && npm install
	cd ./api-gateway && npm install
	cd ./processor-service && npm install


.PHONY: run-kafka postgres run-postgres createdb  dropdb