module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [20, 60]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 400]
      }
    },
    averageRating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5
      }
    }
  }, {
    timestamps: true,
    tableName: 'stores'
  });

  return Store;
};