module.exports = (sequelize, DataTypes) => {
  const JoinRequest = sequelize.define('JoinRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'declined'),
      defaultValue: 'pending',
      allowNull: false
    }
  }, {
    timestamps: true,
    indexes: [
      // Compound index to ensure a user can only have one request per event
      {
        unique: true,
        fields: ['userId', 'eventId']
      }
    ]
  });

  JoinRequest.associate = function(models) {
    // JoinRequest belongs to a User
    JoinRequest.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    // JoinRequest belongs to an Event
    JoinRequest.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event'
    });
  };

  return JoinRequest;
};