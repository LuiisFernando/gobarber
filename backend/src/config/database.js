require('dotenv/config');

module.exports = {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    define: {
        timestamps: true,
        underscored: true,
        uderscoredAll: true,
    },
};

/*

create migration:
yarn sequelize migration:create --name=nome-da-migration

run migrate:
yarn sequelize db:migrate

to rollback
yarn sequelize db:migrate:undo << undo last migrations
or
yarn sequelize db:migrate:undo:all << undo all migrations
*/
