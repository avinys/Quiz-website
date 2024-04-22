const bcrypt = require('bcrypt');
const mongodb = require('mongodb');
const db = require('../database');

class User {
    constructor (username, password, email, fullName, role) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = fullName;
        this.role = role;
    }

    static async findById(userId) {
        const uid = new mongodb.ObjectId(userId);

        return await db.getDb().collection('users').findOne({ _id: uid }, { projection: { password: 0 }});
    }

    getUserWithSameUsername() {
        return db.getDb().collection('users').findOne({ username: this.username });
    }

    async existsAlready() {
        const existingUser = await this.getUserWithSameEmail();
        if(!existingUser) {
            return false;
        } else {
            return true;
        }
    }

    async signup() {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(this.password, saltRounds);

        await db.getDb().collection('users').insertOne({
            username: this.username,
            email: this.email,
            password: hashedPassword, 
            name: this.name,
            role: this.role
        });
    }

    hasMatchingPassword(hashedPassword) {
       return bcrypt.compare(this.password, hashedPassword);
    }
}

module.exports = User;