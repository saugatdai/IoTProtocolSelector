import { PolynomialRegressor } from "@rainij/polynomial-regression-js";

export default class Predictor {
    private models: Map<string, PolynomialRegressor>;

    constructor() {
        this.models = new Map();
    }

    addModel(name: string, model: PolynomialRegressor) {
        this.models.set(name, model);
    }

    predict(name: string, data: number[][]): number[][] {
        const model = this.models.get(name);
        if (!model) {
            throw new Error(`Model ${name} not found`);
        }
        return model.predict(data);
    }
}