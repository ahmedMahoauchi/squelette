import express from 'express'
import Game from '../models/game.js'

const router = express.Router();



//Get All Games
export function getAll(req,res){
   Game.find({})
    // .where('onSale').equals(true) // Si 'OnSale' a la valeur true
    // .where('year').gt(2000).lt(2022) // Si 2000 < 'year' < 2022 
    // .where('name').in(['DMC5', 'RE8', 'NFS']) // Si 'name' a l'une des valeurs du tableau
    // .limit(10) // Récupérer les 10 premiers seulement
    // .sort('-year') // Tri descendant (enlever le '-' pour un tri ascendant)
    // .select('name') // Ne retourner que les attributs mentionnés (séparés par des espace si plusieurs)
    // .exec() // Executer la requête
       .then(docs =>{
        res.status(200).json(docs)
       })
       .catch(err => {
        res.status(500).json({error:err})
       }) 
}

//Get Game By Name
export function getByName(req,res){
    Game.findOne({"name":req.params.name})
        .then(doc => {
            res.status(200).json(doc)
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
}

//Get Game By ID
export function getById(req,res){
    Game.findById(req.params.id)
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({error : err})
        })
    
}



//Add Game
export function addOnce(req,res){
    
   Game.create({
    name:req.body.name,
        year:req.body.year,
        onSale:req.body.onSale
   }).then(newGame => {
    res.status(200).json(newGame)
   })
   .catch(err => {
    res.status(500).json({error: err})
   })
}

//Update Game
export function updateGame(req,res){
    
    Game.findByIdAndUpdate(req.params.id,req.body)
        .then(newGame => {
        Game.findById(req.params.id)
            .then(doc2 => {
                res.status(200).json(doc2)
            })
            .catch(err => {
                res.status(500).json({error : err})
            })

        })
    .catch(err => {
     res.status(500).json({error: err})
    })
 }


 //Update All Games
 export function putAll(req, res) {
    Game
    .updateMany(req.body)
    .then(() => {
        res.status(200).json({message : true});
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}


//Delete One Game By ID
export function deleteOnce(req, res) {
    Game
    .findByIdAndDelete(req.params.id)
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

//Delete All Games 
export function deleteAllGames(req, res) {
        Game
        .remove({})
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    }