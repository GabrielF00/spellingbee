import http from "./http-common";
import {SubmitWordResponse} from "spellbee";
import {AxiosResponse} from "axios";

class SpellBeeService {

    async submitWord(data: unknown): Promise<SubmitWordResponse> {
        return await http.post<unknown, AxiosResponse<SubmitWordResponse>>("/submitWord", data)
            .then(response => response.data);
    }

}

export default new SpellBeeService();