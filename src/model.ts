import { PolynomialRegressor } from "@rainij/polynomial-regression-js";
import DataSet from "./dataSet";

const MQTT_MODEL = new PolynomialRegressor(3);
const HTTP_MODEL = new PolynomialRegressor(3);
const COAP_MODEL = new PolynomialRegressor(3);

MQTT_MODEL.fit(DataSet.MQTTX, DataSet.MQTTY);
HTTP_MODEL.fit(DataSet.HTTPX, DataSet.HTTPY);
COAP_MODEL.fit(DataSet.COAPX, DataSet.COAPY);

export default {
    MQTT_MODEL,
    HTTP_MODEL,
    COAP_MODEL
}

