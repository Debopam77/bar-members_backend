const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const membersSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        middleName: {
            type: String,
            required: false,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
    },
    password: {
        type: String,
        required: false,
        trim: true,
        validate: (pass) => {
            if (pass.length > 6) {
                const easyPass = ['password', '1234'];
                const flag = easyPass.every((p) => {
                    if (pass.toLowerCase().includes(p)) {
                        return false;
                    } else
                        return true;
                });
                if (flag === false)
                    throw new Error('Choose an uncommon password');
            } else {
                throw new Error('Length must be greater than 6')
            }
        }
    },
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
        validate: (value) => {
            if (!validator.isEmail(value))
                throw new Error('Invalid email entered..');
        }
    },
    dateOfBirth: {
        type: Date,
        required: false
    },
    address: {
        chamberAddress: {
            type: String,
            required: false,
            trim: true
        },
        chamberPincode: {
            type: Number,
            required: false
        },
        residentialAddress: {
            type: String,
            required: false,
            trim: true
        },
        residentialPincode: {
            type: Number,
            required: false
        }

    },
    //TO DO ---- CHAMBER DAYS OPEN
    chamberOpenDays: [{
        value: {
            type: Number,
            required: false
        },
    }],
    chamberOptional: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    experience: {
        type: Number,
        trim: true
    },
    qualification: {
        type: String,
        required: false,
        trim: true
    },
    memberOfLibrary: {
        type: String,
        required: false,
        trim: true
    },
    memberOf: {
        type: String,
        required: false,
        trim: true
    },
    courtOfPractice: [{
        value: {
            type: String,
            required: false,
            trim: true
        }
    }],
    expertise: [{
        value: {
            type: String,
            required: false,
            trim: true
        }
    }],
    isAdmin: {
        type: Boolean,
        default : false,
        required: true,
        trim: true
    },
    registration: {
        type: String,
        unique: true,
        required: false,
        trim: true
    },
    registrationYear: {
        type: String,
        required: false,
        trim: true
    },
    certificates: [{
        value: {
            type: String,
            required: false,
            trim: true
        }
    }],
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps: true
});

//Getting public member details
membersSchema.methods.toJSON = function () {
    const member = this;
    return {
        name: {
            firstName : member.name.firstName,
            middleName : member.name.middleName,
            lastName: member.name.lastName
        },
        isAdmin : member.isAdmin,
        address: {
            chamberAddress: member.address.chamberAddress,
            chamberPincode: member.address.chamberPincode,
            residentialAddress: member.address.residentialAddress,
            residentialPincode: member.address.residentialPincode
        },
        dateOfBirth: (member.dateOfBirth ? member.dateOfBirth.toLocaleDateString('IST') : undefined),
        age : (member.dateOfBirth ? 
            (new Date(Date.now()).getFullYear() - member.dateOfBirth.getFullYear()) : undefined ),
        email: member.email,
        phone: member.phone,
        experience: member.experience,
        memberOf: member.memberOf,
        memberOfLibrary: member.memberOfLibrary,
        registration: member.registration,
        registrationYear: member.registrationYear,
        chamberOptional: member.chamberOptional,
        expertise: member.expertise.map((skill) => skill.value),
        certificates: member.certificates.map((certificate) => certificate.value),
        courtOfPractice: member.courtOfPractice.map((court) => court.value),
        chamberOpenDays: member.chamberOpenDays.map((day) => day.value),
        avatar : member.avatar,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt
    };
}

//Generating and concatinating new token string to member
membersSchema.methods.generateAuthToken = async function () {
    const member = this;
    const token = jwt.sign({ _id: member._id.toString() }, process.env.JWT_SALT);
    member.tokens = member.tokens.concat({ token });
    await member.save();
    return token;
}

//Find member by phone and password combo
membersSchema.statics.findByCredentials = async (phone, password) => {
    const member = await Members.findOne({ phone });
    if (!member) {
        throw new Error('Wrong username or password');
    } else {
        const isMatch = await bcrypt.compare(password, member.password);

        if (!isMatch) {
            throw new Error('Wrong username or password');
        }
        return member;
    }
};

//Hashing plaintext password before saving
membersSchema.pre('save', async function (next) {
    const member = this;

    if (member.isModified('password')) {
        member.password = await bcrypt.hash(member.password, 8);
    }
    next();
});

//Create new Members collection
const Members = mongoose.model('Members', membersSchema);

module.exports = Members;