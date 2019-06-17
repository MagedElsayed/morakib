const Sequelize = require("sequelize"),
      db = require("../../database/connection"),
      User = require("../auth/models").User;



const Gawla = db.define("gawla", {
    name: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    Address: {
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

const PenaltyTerm = db.define("penalty_term", Object.assign(penalty_attrs, {addons: {
    type: Sequelize.TEXT,
    allowNull: true
}}), {sequelize: db});

PenaltyClass.hasMany(PenaltyType);
PenaltyType.belongsTo(PenaltyClass);

PenaltyType.hasMany(PenaltyTerm);
PenaltyTerm.belongsTo(PenaltyType);

const Penalty = db.define("penalty", {
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
    }
    
});

Penalty.belongsTo(User);
Penalty.belongsTo(Gawla);
Penalty.belongsTo(PenaltyClass,{as: "penaltyClassId"});
Penalty.belongsTo(PenaltyType,{as: "penaltyTypeId"});
Penalty.belongsTo(PenaltyTerm,{as: "penaltyTermId"});
// User.hasMany(Penalty,{as: "penaltyUserId"});
Penalty.belongsTo(User,{as: "penaltyUserId"})
// PenaltyClass.hasMany(Penalty,{as: "penaltyClassId"});
// PenaltyType.hasMany(Penalty,{as: "penaltyTypeId"});
// PenaltyTerm.hasMany(Penalty,{as: "penaltyTermId"});
Gawla.belongsTo(User, {foreignKey: "inspector_id"});
Gawla.belongsTo(User, {foreignKey: "manager_id"});
Gawla.belongsTo(PenaltyClass, {foreignKey: "class_id"});
// Gawla.belongsTo(PenaltyType);
// Gawla.belongsTo(PenaltyTerm);
PenaltyClass.hasMany(Gawla ,{foreignKey: "class_id"});
// PenaltyType.hasMany(Gawla);
// PenaltyTerm.hasMany(Gawla);
User.hasMany(Gawla, {foreignKey: "inspector_id"});
User.hasMany(Gawla, {foreignKey: "manager_id"});


module.exports.Penalty = Penalty;
module.exports.Gawla = Gawla;
module.exports.PenaltyClass = PenaltyClass;
module.exports.PenaltyTerm = PenaltyTerm;
module.exports.PenaltyType = PenaltyType;