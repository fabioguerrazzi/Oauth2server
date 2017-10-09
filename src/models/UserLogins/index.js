

module.exports = function (sequelize, DataTypes) {
  var UserLogins = sequelize.define('UserLogins',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      loginDate: DataTypes.DATE,
      loginResult: DataTypes.STRING,
      ignore: DataTypes.STRING
    },
    {
      classMethods: {
        associate(models) {
          UserLogins.belongsTo(models.Users, { foreignKey: 'userId' });
        }

      },
      createdAt: false,
      updatedAt: false,
      freezeTableName: true
    });

  return UserLogins;
};
