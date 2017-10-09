

module.exports = function (sequelize, DataTypes) {
  var UserScopes = sequelize.define('UserScopes',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      scopeId: DataTypes.STRING
    },
    {
      classMethods: {
        associate(models) {
          UserScopes.belongsTo(models.Users, { foreignKey: 'userId' });
        }

      },
      createdAt: false,
      updatedAt: false,
      freezeTableName: true
    });

  return UserScopes;
};
