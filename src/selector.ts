/// <reference path="./types.d.ts" />
import weightedSum from "weighted-sum";

export interface Prediction {
    MQTT: {
        cpu: number | undefined,
        ram: number | undefined
    },
    HTTP: {
        cpu: number | undefined,
        ram: number | undefined
    },
    COAP: {
        cpu: number | undefined,
        ram: number | undefined
    }
}

export interface Weights {
    cpuWeight: number | undefined;
    ramWeight: number | undefined;
}

export default class Selector {

    constructor(private prediction: Prediction, private weights: Weights) { }

    predict() {
        const data = [
            { id: "MQTT", cpu: this.prediction.MQTT.cpu, ram: this.prediction.MQTT.ram },
            { id: "HTTP", cpu: this.prediction.HTTP.cpu, ram: this.prediction.HTTP.ram },
            { id: "COAP", cpu: this.prediction.COAP.cpu, ram: this.prediction.COAP.ram }
        ]

        const sortOptions = {
            includeScore: true,
            cpu: { weight: this.weights.cpuWeight, sort: 'desc' },
            ram: { weight: this.weights.ramWeight, sort: 'desc' }
        }

        const results = weightedSum(data, sortOptions);

        return {
            selectedProdocol: results[0].id,
            secondPriority: results[1].id,
            thirdPriority: results[2].id
        }
    }
}
