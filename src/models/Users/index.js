module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users',
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      locationId: DataTypes.STRING,
      type: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      lastChangedPassword: DataTypes.DATE,
      enabled: DataTypes.STRING,
      locked: DataTypes.STRING,
      forcePasswordChange: DataTypes.STRING,
      created: DataTypes.DATE,
      createdBy: DataTypes.STRING,
      lastUpdate: DataTypes.DATE,
      lastUpdateBy: DataTypes.STRING,
      gender: DataTypes.STRING,
      dateOfBirth: DataTypes.DATE,
      yearOfStudy: DataTypes.STRING,
      isEmployee: DataTypes.STRING,
      isStudent: DataTypes.STRING,
      allowContact: DataTypes.STRING
    },
    {
      classMethods: {
        associate(models) {
          Users.hasMany(models.AccessTokens, {
            foreignKey: 'userId'
          });
        }
      },
      createdAt: 'created',
      updatedAt: 'lastUpdate',
      freezeTableName: true
    });

  return Users;
};
