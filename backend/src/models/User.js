module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true
    },
    locationName: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  User.associate = function(models) {
    // User can host many events
    User.hasMany(models.Event, {
      foreignKey: 'hostId',
      as: 'hostedEvents'
    });

    // User can make many join requests
    User.hasMany(models.JoinRequest, {
      foreignKey: 'userId',
      as: 'joinRequests'
    });
  };

  return User;
};