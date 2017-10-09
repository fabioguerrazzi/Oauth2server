

module.exports = function (sequelize, DataTypes) {
  var UserApplications = sequelize.define('UserApplications',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      applicationId: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    },
    {
      classMethods: {
        associate(models) {
          UserApplications.belongsTo(models.Users, { foreignKey: 'userId' });
          UserApplications.belongsTo(models.Applications, { foreignKey: 'applicationId' });
        }

      },
      createdAt: false,
      updatedAt: false,
      freezeTableName: true
    });

  return UserApplications;
};
