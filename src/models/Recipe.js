import { DataTypes } from 'sequelize';

export default (sequelize, DataTypes) => {
    const Recipe = sequelize.define('Recipe', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        ingredients: {
            type: DataTypes.TEXT, 
            allowNull: false,
            set(val) {
                this.setDataValue('ingredients', JSON.stringify(val));
            },
            get() {
                const rawValue = this.getDataValue('ingredients');
                return rawValue ? JSON.parse(rawValue) : [];
            }
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        prepTime: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: 'recipes', 
        timestamps: true,
        freezeTableName: true 
    });
    return Recipe;
};