

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Directories',
    {
      directoryId: {
        type: DataTypes.STRING,
        primaryKey: true
      },

      description: DataTypes.STRING,
      minPasswordLength: DataTypes.INTEGER,
      maxPasswordLength: DataTypes.INTEGER,
      minLowercaseLength: DataTypes.INTEGER,
      minUppercaseLength: DataTypes.INTEGER,
      minNumericLength: DataTypes.INTEGER,
      minSymbolLength: DataTypes.INTEGER
    },
    {
      classMethods: {
      },
      createdAt: false,
      updatedAt: false,
      freezeTableName: true
    });
};
