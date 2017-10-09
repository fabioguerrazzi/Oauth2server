

module.exports = function (sequelize, DataTypes) {
  var UserPasswordTokens = sequelize.define('UserPasswordTokens',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      token: DataTypes.STRING,
      expires: DataTypes.DATE
    },
    {
      classMethods: {
        associate(models) {
          UserPasswordTokens.belongsTo(models.Users, { foreignKey: 'userId' });
        }

      },
      createdAt: false,
      updatedAt: false,
      freezeTableName: true
    });

  return UserPasswordTokens;
};
