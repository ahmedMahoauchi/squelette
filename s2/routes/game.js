import express from 'express'

import {
    getAll,
    getByName,
    addOnce,
    getById,
    updateGame,
    putAll,
    deleteOnce,
    deleteAllGames

}from'../controllers/game.js'

const router = express.Router();

router.route('/game/addOnce').post(addOnce)

router.route('/game/games').get(getAll)

router.route('/game/gameByName/:name').get(getByName)

router.route('/game/gameById/:id').get(getById)

router.route('/game/updateGame/:id').put(updateGame)

router.route('/game/updateGames').put(putAll)

router.route('/game/deleteGame/:id').delete(deleteOnce)

router.route('/game/deleteGames').delete(deleteAllGames)




export default router