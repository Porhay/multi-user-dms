ss:
    # --- SERVER SIDE ---
    # npm install
	@if [ -d "server/node_modules" ]; then \
		echo "[server] Node modules is exist"; \
	else \
		echo "Installing node_modules..."; \
		cd server && npm install; \
    fi

    # start database
	mkdir -p server/dev-deploy/persistent/imported-data
	mkdir -p server/dev-deploy/persistent/image-data

	docker-compose -f server/dev-deploy/docker-compose.yml down;
	docker-compose -f server/dev-deploy/docker-compose.yml up -d postgresql;
	until nc -z -v -w30 localhost 5432; do echo "Waiting for postgresql...";  sleep 5; done
	@echo "Database started..."

    # npm run dev
	npm run dev --prefix ./server
	@echo "[step 1] Server is running...";


cs:
    # --- CLIENT SIDE ---
    # npm install
	@if [ -d "client/node_modules" ]; then \
		echo "[client] Node modules is exist"; \
	else \
		echo "Installing node_modules..."; \
		cd client && npm install; \
    fi

    # npm run start
	npm run start --prefix ./client
	@echo "[step 2] Client is running...";


kill:
	@echo "Killing all...";
	npx kill-port 3000
	npx kill-port 8000


all:
    # server side
	@echo "[1] Starting shelter-gateway"
	@osascript -e 'tell app "Terminal" to do script "cd $(CURDIR) && make ss"'

    # client side
	@echo "[2] Starting shelter-accounts"
	@osascript -e 'tell app "Terminal" to do script "cd $(CURDIR) && make cs"'