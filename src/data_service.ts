import http from "./http-common";
import {
    EndGameRequest,
    EndGameState,
    GameState, JoinGameRequest, JoinGameResponse,
    StartGameRequest,
    SubmitWordRequest,
    SubmitWordResponse
} from "spellbee";
import {AxiosResponse} from "axios";


class SpellBeeService {

    async createGame(data: StartGameRequest): Promise<GameState> {
        return await http.post<StartGameRequest, AxiosResponse<GameState>>("/createGame", data).then(response => response.data);
    }

    async joinGame(data: JoinGameRequest): Promise<JoinGameResponse> {
        return await http.post<JoinGameRequest, AxiosResponse<JoinGameResponse>>('/joinGame', data).then(response => response.data);
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