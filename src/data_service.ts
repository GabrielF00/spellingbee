import http from "./http-common";
import {GameState, SubmitWordResponse} from "spellbee";
import {AxiosResponse} from "axios";

class SpellBeeService {

    async createGame(): Promise<GameState> {
        return await http.post<unknown, AxiosResponse<GameState>>("/createGame").then(response => response.data);
    }

    async submitWord(data: unknown): Promise<SubmitWordResponse> {
        return await http.post<unknown, AxiosResponse<SubmitWordResponse>>("/submitWord", data)
            .then(response => response.data);
    }

}

export default new SpellBeeService();