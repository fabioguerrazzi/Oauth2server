

module.exports = function (sequelize, DataTypes) {
  var UserDirectories = sequelize.define('UserDirectories',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      directoryId: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    },
    {
      classMethods: {
        associate(models) {
          UserDirectories.belongsTo(models.Users, { foreignKey: 'userId' });
          UserDirectories.belongsTo(models.Directories, { foreignKey: 'directoryId' });
        }

      },
      createdAt: false,
      updatedAt: false,
      freezeTableName: true
    });

  return UserDirectories;
};
