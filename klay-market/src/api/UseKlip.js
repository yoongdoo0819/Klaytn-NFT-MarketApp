import axios from "axios";
import { STORAGE_CONTRACT_ADDRESS } from "../constants";

const A2P_API_PREPARE_URL = "https://a2a-api.klipwallet.com/v2/a2a/prepare";
const APP_NAME = "KLAY_MARKET";

export const setNumber = (number, setQrvalue) => {
    
    axios.post(
        A2P_API_PREPARE_URL, {
            bapp: {
                name: APP_NAME,
            },
            type: "execute_contract",
            transaction: {
                to: STORAGE_CONTRACT_ADDRESS,
                value: "0",
                abi: '{ "inputs": [ { "internalType": "uint256", "name": "num", "type": "uint256" } ], "name": "store", "outputs": [], "stateMutability": "nonpayable", "type": "function" }',
                params: `[\"${number}\"]`
            }
        }
    ).then((response) => {
        const { request_key } = response.data;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        setQrvalue(qrcode);

        let timerId = setInterval(() => {
            axios.get(
                `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
            )
            .then((res) => {
                if (res.data.result) {
                    //console.log(res.data.expiration_time);
                    //console.log(res.data.result);
                    console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                    clearInterval(timerId);
                }
            });
        }, 1000);
    });
};


export const getAddress = (setQrvalue) => {
    
    axios.post(
        A2P_API_PREPARE_URL, {
            bapp: {
                name: APP_NAME,
            },
            type: "auth"
        }
    ).then((response) => {
        const { request_key } = response.data;
        const qrcode = `https://klipwallet.com/?target=/a2a?request_key=${request_key}`;
        setQrvalue(qrcode);

        let timerId = setInterval(() => {
            axios.get(
                `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`
            )
            .then((res) => {
                if (res.data.result) {
                    //console.log(res.data.expiration_time);
                    //console.log(res.data.result);
                    console.log(`[Result] ${JSON.stringify(res.data.result)}`);
                    clearInterval(timerId);
                }
            });
        }, 1000);
    });
};

