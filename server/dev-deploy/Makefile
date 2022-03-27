
init:
	mkdir -p persistent/postgresql


run:
	sudo chmod -R 0777 persistent;
	sudo docker-compose down;

	sudo docker-compose up -d postgresql;
	until nc -z -v -w30 localhost 5432; do echo "Waiting for postgresql...";  sleep 5; done

	sudo docker-compose up -d pgadmin;
	until nc -z -v -w30 localhost 5432; do echo "Waiting for pgadmin...";  sleep 5; done

	@echo "Database started..."

