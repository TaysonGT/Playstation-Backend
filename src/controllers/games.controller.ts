import {Response, Request} from "express"
import { myDataSource } from "../app-data-source";
import { Game } from "../entity/game.entity";
import { addGameDto } from "../dto/add-game.dto";

const gameRepo = myDataSource.getRepository(Game)

const allGames = async (req:Request, res:Response)=>{
    const games = await gameRepo.find()
    res.json({games})
}

const addGame = async(req: Request, res: Response)=>{
    const {name} = req.body;

    const gameData:addGameDto = {name}
    const game = gameRepo.create(gameData)
    const created = await gameRepo.save(game)

    res.json({success: true, created, message: "تمت اللعبة بنجاح"})
}

const deleteGame = async(req: Request, res: Response)=>{
    const {id} = req.params;
    const game = await gameRepo.findOne({where: {id}})
    if(game){
        const deleted = await gameRepo.remove(game)
        res.json({success: true, deleted, message: "تمت إزالة اللعبة بنجاح"})
    }else{
        res.json({success: false, message: "حدث  خطأ ما"})
    }

}

export {
    allGames,
    addGame,
    deleteGame
}