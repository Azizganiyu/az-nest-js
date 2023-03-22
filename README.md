
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Database

For a transactional system, a relational database is best used because it ensures your data is stored only once, so you shouldn't get data anomalies. The ability to define schema and constraints introduces certain limitations that ensure data integrity. Also, authentication and access privilege are handled better in a relational database.

The two relational database that comes to mind are MySQL and PostgreSQL.

I decided to go with MySQL because of its popularity and ease of use, and because MySQL is suitable with the task at hand without introducing any complexity. 