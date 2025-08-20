import axios from 'axios';

// Para Apache, siempre usar el proxy /api
const AZURE_ML_ENDPOINT = '/api/score';

const DEFAULT_API_KEY = import.meta.env.VITE_AZURE_API_KEY;

export const valorarVehiculo = async (vehicleData, apiKey = null) => {
  try {
    const keyToUse = apiKey || DEFAULT_API_KEY;
    
    if (!keyToUse) {
      throw new Error('No se encontró clave API');
    }

    const data = {
      "Inputs": {
        "input1": [{
          "brand": vehicleData.marca.toUpperCase(),
          "model_year": parseInt(vehicleData.año),
          "milage": parseInt(vehicleData.millaje),
          "engine": vehicleData.esElectrico ? "ELECTRIC" : vehicleData.litrosMotor
        }]
      },
      "GlobalParameters": {}
    };

    console.log('Enviando petición a:', AZURE_ML_ENDPOINT);
    console.log('Datos:', data);

    const response = await axios.post(AZURE_ML_ENDPOINT, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${keyToUse.trim()}`
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    console.error('Error en valorarVehiculo:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout: La petición tardó demasiado');
    }
    
    if (error.response) {
      throw new Error(`Error HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`);
    }
    
    if (error.request) {
      throw new Error('Error de conexión: No se pudo conectar con el servidor');
    }
    
    throw error;
  }
};

export const loadApiKey = () => {
  return localStorage.getItem('azure_api_key') || DEFAULT_API_KEY || '';
};

export const saveApiKey = (key) => {
  localStorage.setItem('azure_api_key', key);
};

export const hasDefaultApiKey = () => {
  return !!DEFAULT_API_KEY;
};

export const getDefaultApiKey = () => {
  return DEFAULT_API_KEY;
};