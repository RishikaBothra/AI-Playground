### backend

- we are using [`uv`](https://docs.astral.sh/uv/) for python project management.
- `fastapi` is powering the backend server.
- `sqlalchemy` is ORM for db ops.
- `alembic` is used for db migrations.

scripts
1. install dependencies
```bash
uv sync
```
2. setup `.env` variables
```bash
cp .env.example .env
```
make sure to update the variables in `.env` file to appropriate values.

3. run migrations
```bash
uv run alembic upgrade head
```

4. run `uvicorn` server
```bash
make dev    # dev script is in root Makefile
```
the dev server should be running at `http://127.0.0.1:8000`
