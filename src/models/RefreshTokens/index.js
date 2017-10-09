

module.exports = function (sequelize, DataTypes) {
  var RefreshTokens = sequelize.define('RefreshTokens',
    {
      tokenId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      userId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      applicationId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      expires: DataTypes.DATE,
      scope: DataTypes.STRING
    },
    {
      classMethods: {
        associate(models) {
          RefreshTokens.belongsTo(models.Users, { foreignKey: 'userId' });
          RefreshTokens.belongsTo(models.Applications, { foreignKey: 'applicationId' });
        }

      },
      createdAt: false,
      updatedAt: false,
      freezeTableName: true
    });

  return RefreshTokens;
};
