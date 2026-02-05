import express, { Request, Response } from 'express';
import cors from 'cors';
import Predictor from './Predictor';
import model from './model';
import Selector, { Prediction, Weights } from './selector';
import path from 'path';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

interface ClientConfig {
    clients: number;
    messagesPerSecond: number;
    payloadSize: number;
    cpuWeight: number;
    ramWeight: number;
}

app.post('/log-config', (req: Request, res: Response) => {
    const { clients, messagesPerSecond, payloadSize, cpuWeight, ramWeight } = req.body as ClientConfig;

    const predictor = new Predictor();
    predictor.addModel("MQTT", model.MQTT_MODEL);
    predictor.addModel("HTTP", model.HTTP_MODEL);
    predictor.addModel("COAP", model.COAP_MODEL);

    const mqttPrediction = predictor.predict("MQTT", [[payloadSize, messagesPerSecond, clients]]) as number[][];
    const httpPrediction = predictor.predict("HTTP", [[payloadSize, messagesPerSecond, clients]]) as number[][];
    const coapPrediction = predictor.predict("COAP", [[payloadSize, messagesPerSecond, clients]]) as number[][];

    const prediction: Prediction = {
        MQTT: {
            cpu: mqttPrediction[0]?.[0],
            ram: mqttPrediction[0]?.[1]
        },
        HTTP: {
            cpu: httpPrediction[0]?.[0],
            ram: httpPrediction[0]?.[1]
        },
        COAP: {
            cpu: coapPrediction[0]?.[0],
            ram: coapPrediction[0]?.[1]
        }
    }

    const weights: Weights = {
        cpuWeight,
        ramWeight
    }

    const selector = new Selector(prediction, weights);
    const result = selector.predict();

    res.status(200).send(result);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
