import http from "./http-common";
import {EndGameState, GameState, SubmitWordResponse} from "spellbee";
import {AxiosResponse} from "axios";

export interface SubmitWordRequest {
    gameId: number,
    word: string
}

export interface EndGameRequest {
    gameId: number
}

class SpellBeeService {

    async createGame(): Promise<GameState> {
        return await http.post<unknown, AxiosResponse<GameState>>("/createGame").then(response => response.data);
    }

    async submitWord(data: SubmitWordRequest): Promise<SubmitWordResponse> {
        return await http.post<SubmitWordRequest, AxiosResponse<SubmitWordResponse>>("/submitWord", data)
            .then(response => response.data);
    }

    async endGame(data: EndGameRequest): Promise<EndGameState> {
        return await http.post<EndGameRequest, AxiosResponse<EndGameState>>("/endGame", data).then(response => response.data);
    }

}

export default new SpellBeeService();