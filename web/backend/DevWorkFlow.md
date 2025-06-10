# Daily Development Workflow

## Use these commands from the project root directory
# Daily Development Workflow

Use these commands from the project root directory.

---

### First-Time Setup

If you are setting up this project for the first time, follow these steps in order:

1.  **Start all services:**
    ```bash
    docker-compose up -d --build
    ```

2.  **Run the database migrations:**
    This command will read the `prisma/migrations` folder (which includes our manual SQL enhancements) and build your local database correctly.
    ```bash
    docker-compose exec backend npx prisma migrate deploy
    ```
    *Note: We use `migrate deploy` as it's good practice, but `migrate dev` would also work here.*

---

### Making Schema Changes (Daily Workflow)

When you need to change the database schema:

1.  **Edit your `prisma/schema.prisma` file.**

2.  **Create a new migration:**
    ```bash
    # This creates a new migration file. Give it a descriptive name.
    docker-compose exec backend npx prisma migrate dev --name your-change-description
    ```

3.  **Manually Edit the New Migration File (If Needed):**
    If your changes require manual SQL (like adding a new `ltree` feature), open the newly created `migration.sql` file and add your SQL commands to the bottom.

---

### Other Useful Commands

*   **View the database with Prisma Studio:**
    `npx prisma studio`

*   **View logs for all services:**
    `docker-compose logs -f`

*   **Stop all services:**
    `docker-compose down`

