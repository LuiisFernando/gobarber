module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
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
