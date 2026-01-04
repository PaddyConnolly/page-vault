.PHONY: backend frontend server all stop

backend:
	cd backend && uv sync
	cd backend && uv run uvicorn src.main:app --reload

frontend:
	cd frontend && npm install
	cd frontend && npm run dev

server:
	cd rust && cargo build
	cd rust && cargo run

all:
	make backend & make frontend & make server

stop:
	-fuser -k 8000/tcp
	-fuser -k 5173/tcp
	-fuser -k 8080/tcp

