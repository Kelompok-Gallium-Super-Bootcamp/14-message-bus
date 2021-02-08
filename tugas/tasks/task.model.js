const { DataTypes } = require('sequelize');

exports.model;

exports.defineModel = function (orm) {
  exports.model = orm.define(
    'task',
    {
      job: DataTypes.TEXT,
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      document: DataTypes.TEXT,
      addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      tableName: 'tasks',
    }
  );
};
