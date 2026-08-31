const bcrypt = require("bcrypt");
const users = require("../models/usermodel");
const jwt = require("jsonwebtoken")
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

const login = async(req,res) => {
    try{
        const{email, password} = req.body;
        const user = users.find(user => user.email === email);
        if(!user){
            return res.status(404).json({
                message: "user not found"
            });
        }
        const ismatch = await bcrypt.compare(password, user.password);
        if(!ismatch){
            return res.status(401).json({
                message:"Invalid password"
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            "mysecretkey",
            {
                expiresIn:"1h"
            }
        );
        res.json({
            message: "Login successful",
            token
        })
    }catch(error){
        res.status(500).json({
            message: "Server Error"
        })
    }
};
const me = (req,res) =>{
    res.json({
        message: "User information",
        user: req.user
    });
};
const getUsers = (req,res) =>{
    const userlist = users.map(user=>({
        id: user.id,
        name: user.name,
        email: user.email
    }));
    res.json(userlist);
};
module.exports = {
    register,
    login,
    me,
    getUsers
};