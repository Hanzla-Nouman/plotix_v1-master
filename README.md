## Install & Run

0. Make sure .env file is matching the environment you need.
1. `yarn` - install dependencies
2. Install docker
3. `docker-compose up -d` - spin up local postgresql & s3 instance
4. Go to localhost:9000 and create a new bucket for local s3, and set the ACl to public.
5. `yarn db:sync` - generates zod definitions in prisma/generate/zod and seeds the database.
6. `yarn db:seed` (optional) - populate seed data if needed
7. `yarn dev` - launch the app

## Re-setting the database

1. Make sure docker-compose is up and running
2. Then in the root folder of the app run `yarn db:sync --force-reset`
3. Optionally you can also go to the localhost:9000 and re-create the bucket.
