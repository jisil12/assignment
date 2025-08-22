module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    role: {
      type: DataTypes.ENUM('system_admin', 'normal_user', 'store_owner'),
      allowNull: false,
      defaultValue: 'normal_user'
    }
  }, {
    timestamps: true,
    tableName: 'users'
  });

  return User;
};