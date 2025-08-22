const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
  logging: config.logging
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize);
db.Store = require('./Store')(sequelize, Sequelize);
db.Rating = require('./Rating')(sequelize, Sequelize);

db.User.hasMany(db.Rating, { foreignKey: 'userId' });
db.Store.hasMany(db.Rating, { foreignKey: 'storeId' });
db.Rating.belongsTo(db.User, { foreignKey: 'userId' });
db.Rating.belongsTo(db.Store, { foreignKey: 'storeId' });

module.exports = db;