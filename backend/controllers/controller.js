const bcrypt = require("bcrypt");
const users = require("../models/usermodel");
const register = async(req, res)=>{
    try{
        const{name,email,password} = req.body;
        //checks if the user already exsists
        const exsists = users.find(user => user.email === email);
        if(exsists){
            return res.status(400).json({
                message:"user already exists"
            });
        }

        const hashpass = await bcrypt.hash(password,10);
        const user = { 
            id: users.length + 1,
            name,
            email,
            password: hashpass
        };
        users.push(user);
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }catch(error){
        res.status(500).json({
            message: "Server error"
        });
    }
};
module.exports = {
    register
}