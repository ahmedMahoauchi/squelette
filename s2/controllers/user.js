import express from 'express'
import User from '../models/user.js'

const router = express.Router();





export function signUp(req,res){
   User.create(req.body)
       .then(doc => {
        res.status(200).json(doc);
       }) 
       .catch(err => {
        res.status(500).json({error : err});
       })
    
}

export function signin(req,res){
    const { username, password } = req.body;
    try {
      const user = User.findOne({ username });
      if (!user)
        res.status(404).json({ msg: `username incorrecte` });
      const isMatch = (password == user.password);
      if (!isMatch)
        res.status(401).json({ msg: `passe incorrect` });
  
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ errors: error });
    }  
}

export function getAllUsers(req,res){
    res.status(200).json(users);
}

export function putOnce(req, res) {
    const user = users.find(val => val.id == req.params.id);
    user.username = req.body.username;
    user.password = req.body.password;
    user.wallet = req.body.wallet;
    res.status(200).json(user);
}