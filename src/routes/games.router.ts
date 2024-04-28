import { deleteGame, addGame, allGames } from '../controllers/games.controller'

import express from 'express';
const gamesRouter = express.Router()

gamesRouter.get('/', allGames)
gamesRouter.post('/', addGame)
gamesRouter.delete('/:id', deleteGame)

export default gamesRouter;