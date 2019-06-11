const Sequelize = require("sequelize"),
      db = require("../../database/connection"),
      User = require("../auth/models").User;


const IDType = {
    type: Sequelize.INTEGER(11),
    allowNull:false,
    autoIncreemnt: true,
    primaryKey: true
};

const Gawla = db.define("gawla", {
    id: IDType,
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    done: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    target: {
        type: Sequelize.ENUM(["organizaiton", "individual"]),
        allowNull: false,
    },
    licesnce_no: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    phone_no: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    long: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    lat: {
        type: Sequelize.DECIMAL,
        allowNull: true
    }

    }, {
        underscored: true,
        sequelize: db,
        getterMethods: {
            location(){
                return {long: this.getDataValue("long"), lat: this.getDataValue("lat")};
            }
        },
        setterMethods: {
            location(value){
                this.setDataValue("long", value.long);
                this.setDataValue("lat", value.lat);
            }
        }
});

const penalty_attrs = {
    id: IDType,
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
    },
    descrition: {
        type: Sequelize.TEXT,
        allowNull: true
    }
};

const PenaltyClass = db.define("penalty_class", penalty_attrs, {sequelize: db});

const PenaltyType = db.define("penalty_type", penalty_attrs, {sequelize: db});

const PenaltyTerm = db.define("penalty_term", penalty_attrs, {sequelize: db});

PenaltyClass.hasMany(PenaltyType);
PenaltyType.belongsTo(PenaltyClass);

PenaltyType.hasMany(PenaltyTerm);
PenaltyTerm.belongsTo(PenaltyType);

const Penalty = db.define("penalty", {
    id: IDType,
    value: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    state: {
        type: Sequelize.ENUM(["pending", "approved"]),
        allowNull: false
    },
    addons: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

Penalty.belongsTo(User);
Penalty.belongsTo(Gawla);
Penalty.belongsTo(PenaltyClass);
Penalty.belongsTo(PenaltyType);
Penalty.belongsTo(PenaltyTerm);
User.hasMany(Penalty);
PenaltyClass.hasMany(Penalty);
PenaltyType.hasMany(Penalty);
PenaltyTerm.hasMany(Penalty);

module.exports.Penalty = Penalty;
module.exports.Gawla = Gawla;
module.exports.PenaltyClass = PenaltyClass;
module.exports.PenaltyTerm = PenaltyTerm;
module.exports.PenaltyType = PenaltyType;