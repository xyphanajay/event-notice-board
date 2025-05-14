module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterToday(value) {
          if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
            throw new Error('Event date must be in the future');
          }
        }
      }
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    location: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: false
    },
    locationName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1
      }
    },
    hostId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true,
    indexes: [
      // Add spatial index for the location column
      {
        fields: ['location'],
        using: 'GIST'
      }
    ]
  });

  Event.associate = function(models) {
    // Event belongs to a host (User)
    Event.belongsTo(models.User, {
      foreignKey: 'hostId',
      as: 'host'
    });

    // Event can have many join requests
    Event.hasMany(models.JoinRequest, {
      foreignKey: 'eventId',
      as: 'joinRequests'
    });
  };

  return Event;
};