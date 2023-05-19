import { DataTypes, Model } from 'sequelize';
import sequelize from './db';

class Container extends Model { }

Container.init(
  {
    b64_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    barcode_string: {
      type: DataTypes.VIRTUAL,
      get() {
        return atob(this.b64_code);
      }
    },
    contents: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_added: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    date_added_iso_string: {
      type: DataTypes.VIRTUAL,
      get() {
        if (typeof this.date_added == 'string') {
          return this.date_added
        } else {
          return this.date_added.toISOString().split("T")[0]
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  { sequelize, modelName: 'Container' });


await Container.sync({ alter: true });

export default Container;