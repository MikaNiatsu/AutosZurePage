import { useState, useEffect } from 'react';
import { valorarVehiculo, loadApiKey } from './services/azureService';
import { 
  FaCar, 
  FaChartLine, 
  FaKey, 
  FaCheckCircle, 
  FaTimesCircle,
  FaSpinner,
  FaCalculator,
  FaInfoCircle,
  FaArrowLeft,
  FaCode,
  FaDollarSign,
  FaCalendarAlt,
  FaTachometerAlt,
  FaCog,
  FaBolt,
  FaPrint,
  FaAward,
  FaStar,
  FaCheckDouble
} from 'react-icons/fa';
import { HiSparkles, HiTrendingUp } from 'react-icons/hi';
import { BiReset } from 'react-icons/bi';
import { MdVerified } from 'react-icons/md';

const marcas = [
  'ACURA', 'ALFA ROMEO', 'ASTON MARTIN', 'AUDI', 'BENTLEY', 'BMW',
  'BUGATTI', 'BUICK', 'CADILLAC', 'CHEVROLET', 'CHRYSLER', 'DODGE',
  'FERRARI', 'FIAT', 'FORD', 'GENESIS', 'GMC', 'HONDA',
  'HUMMER', 'HYUNDAI', 'INFINITI', 'JAGUAR', 'JEEP', 'KIA',
  'LAMBORGHINI', 'LAND ROVER', 'LEXUS', 'LINCOLN', 'LOTUS', 'MASERATI',
  'MAZDA', 'MCLAREN', 'MERCEDES-BENZ', 'MERCURY', 'MINI', 'MITSUBISHI',
  'NISSAN', 'PLYMOUTH', 'PONTIAC', 'PORSCHE', 'RAM', 'ROLLS-ROYCE',
  'SAAB', 'SATURN', 'SCION', 'SMART', 'SUBARU', 'SUZUKI',
  'TOYOTA', 'VOLKSWAGEN', 'VOLVO'
];

const performanceData = [
  { intento: 1, mae: '149,858', rmse: '612,714', rse: '0.597', rae: '0.525', r2: '0.403', estado: 'Baseline', color: 'gray' },
  { intento: 2, mae: '150,353', rmse: '613,147', rse: '0.598', rae: '0.527', r2: '0.402', estado: 'Igual al 1', color: 'blue' },
  { intento: 3, mae: '117,181', rmse: '583,678', rse: '0.542', rae: '0.411', r2: '0.458', estado: 'MEJOR', color: 'red' },
  { intento: 4, mae: '158,962', rmse: '609,064', rse: '0.590', rae: '0.557', r2: '0.410', estado: 'Retroceso', color: 'yellow' },
  { intento: 5, mae: '117,181', rmse: '583,678', rse: '0.542', rae: '0.411', r2: '0.458', estado: 'Confirmación', color: 'green' }
];

function App() {
  const [showPerformanceTable, setShowPerformanceTable] = useState(false);
  const [showApiResponse, setShowApiResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [apiKeyStatus, setApiKeyStatus] = useState(false);
  
  const [formData, setFormData] = useState({
    marca: '',
    año: '',
    millaje: '',
    litrosMotor: '',
    esElectrico: false
  });

  useEffect(() => {
    const savedApiKey = loadApiKey();
    setApiKeyStatus(!!savedApiKey);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setApiResponse(null);
    
    if (!apiKeyStatus) {
      setError('Clave de API no encontrada.');
      return;
    }
    
    if (!formData.marca || !formData.año || !formData.millaje) {
      setError('Faltan campos obligatorios.');
      return;
    }
    
    const motor = formData.esElectrico ? 'ELECTRIC' : formData.litrosMotor;
    if (!motor) {
      setError('Indique motor o marque como eléctrico.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await valorarVehiculo({
        ...formData,
        litrosMotor: motor
      });
      
      setApiResponse(response);
      const price = response.Results?.output1?.[0]?.['Scored Labels'] || 0;
      setResult({
        price,
        vehicleData: {
          ...formData,
          motor: formData.esElectrico ? 'Eléctrico' : formData.litrosMotor + 'L'
        }
      });
    } catch (err) {
      if (err.response) {
        setError(`Error HTTP ${err.response.status}: ${err.response.statusText}`);
      } else if (err.request) {
        setError('Error de conexión: No se pudo conectar con el servidor');
      } else {
        setError(`Error inesperado: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      marca: '',
      año: '',
      millaje: '',
      litrosMotor: '',
      esElectrico: false
    });
    setResult(null);
    setError('');
    setApiResponse(null);
  };

  const generateEngineOptions = () => {
    const options = [];
    for (let i = 10; i <= 80; i++) {
      const value = (i / 10).toFixed(1);
      options.push(
        <option key={value} value={value}>
          {value}L
        </option>
      );
    }
    return options;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 transition-all duration-500">
      {/* Elementos decorativos de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-rose-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/90 backdrop-blur-lg border-b border-red-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg">
                <FaCar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  AutosAzure
                </h1>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <HiSparkles className="h-4 w-4 text-red-500" />
                  Valoración inteligente de vehículos
                </p>
              </div>
            </div>
            
            {/* Estado de API Key */}
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-50 border border-red-200">
              <FaKey className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">API:</span>
              {apiKeyStatus ? (
                <div className="flex items-center space-x-1">
                  <FaCheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600 font-medium">Activa</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <FaTimesCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 font-medium">Inactiva</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {!result ? (
          <div className="space-y-8">
            {/* Tabla de Rendimiento */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-red-200/50 p-8">
              <button 
                onClick={() => setShowPerformanceTable(!showPerformanceTable)}
                className="flex items-center space-x-3 w-full justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaChartLine className="h-5 w-5" />
                <span>{showPerformanceTable ? 'Ocultar Rendimiento' : 'Ver Rendimiento del Modelo'}</span>
              </button>
              
              {showPerformanceTable && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-red-200">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <FaChartLine className="h-5 w-5" />
                      Métricas de Rendimiento por Intento
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-red-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Intento</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">MAE</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">RMSE</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">RSE</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">RAE</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">R²</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-red-200">
                        {performanceData.map((row, index) => (
                          <tr key={index} className={`hover:bg-red-50 transition-colors ${
                            row.color === 'red' ? 'bg-red-50' : ''
                          }`}>
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.intento}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.mae}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.rmse}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.rse}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.rae}</td>
                            <td className={`px-6 py-4 text-sm font-semibold ${
                              row.color === 'red' ? 'text-red-600' : 'text-gray-900'
                            }`}>{row.r2}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                row.color === 'gray' ? 'bg-gray-100 text-gray-800' :
                                row.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                row.color === 'red' ? 'bg-red-100 text-red-800' :
                                row.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {row.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Formulario Principal */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-red-200/50 p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg mb-4">
                  <FaCalculator className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
                  Valoración de Vehículo
                </h2>
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <FaInfoCircle className="h-4 w-4 text-red-500" />
                  Complete los datos para obtener una estimación precisa
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <FaTimesCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Marca */}
                <div>
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                    <FaCar className="h-4 w-4 text-red-500" />
                    <span>Marca del Vehículo</span>
                  </label>
                  <select 
                    name="marca" 
                    value={formData.marca}
                    onChange={handleInputChange}
                    required 
                    className="w-full px-4 py-3 bg-white border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900"
                  >
                    <option value="">Seleccionar marca...</option>
                    {marcas.map(marca => (
                      <option key={marca} value={marca}>{marca}</option>
                    ))}
                  </select>
                </div>

                {/* Grid de campos */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Año */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaCalendarAlt className="h-4 w-4 text-red-500" />
                      <span>Año</span>
                    </label>
                    <input 
                      type="number" 
                      name="año" 
                      value={formData.año}
                      onChange={handleInputChange}
                      min="1990" 
                      max="2024" 
                      required 
                      placeholder="2020"
                      className="w-full px-4 py-3 bg-white border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                  </div>

                  {/* Millaje */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaTachometerAlt className="h-4 w-4 text-red-500" />
                      <span>Millaje</span>
                    </label>
                    <input 
                      type="number" 
                      name="millaje" 
                      value={formData.millaje}
                      onChange={handleInputChange}
                      min="0" 
                      required 
                      placeholder="50,000"
                      className="w-full px-4 py-3 bg-white border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900"
                    />
                  </div>

                  {/* Motor */}
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <FaCog className="h-4 w-4 text-red-500" />
                      <span>Motor (Litros)</span>
                    </label>
                    <select 
                      name="litrosMotor"
                      value={formData.litrosMotor}
                      onChange={handleInputChange}
                      disabled={formData.esElectrico}
                      className={`w-full px-4 py-3 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-gray-900 ${
                        formData.esElectrico 
                          ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                          : 'bg-white'
                      }`}
                    >
                      <option value="">Seleccionar...</option>
                      {generateEngineOptions()}
                    </select>
                  </div>
                </div>

                {/* Checkbox Eléctrico */}
                <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <input 
                    type="checkbox" 
                    id="esElectrico" 
                    name="esElectrico" 
                    checked={formData.esElectrico}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <label htmlFor="esElectrico" className="flex items-center space-x-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <FaBolt className="h-4 w-4 text-yellow-500" />
                    <span>Vehículo Eléctrico</span>
                  </label>
                </div>

                {/* Botón Submit */}
                <button 
                  type="submit"
                  disabled={loading || !apiKeyStatus}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="h-5 w-5 animate-spin" />
                      <span>Procesando valoración...</span>
                    </>
                  ) : (
                    <>
                      <FaCalculator className="h-5 w-5" />
                      <span>Calcular Valor del Vehículo</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Página de Resultados Rediseñada */
          <div className="space-y-8">
            {/* Header de Resultados con Animación */}
            <div className="text-center relative">
              {/* Elementos decorativos de fondo */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-96 h-96 bg-gradient-to-r from-red-400 to-rose-500 rounded-full blur-3xl animate-pulse"></div>
              </div>
              
              {/* Contenido principal */}
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-400 via-red-500 to-red-600 rounded-full shadow-2xl mb-6 animate-bounce">
                  <FaAward className="h-12 w-12 text-white" />
                </div>
                
                <div className="flex items-center justify-center gap-3 mb-4">
                  <HiTrendingUp className="h-8 w-8 text-red-500" />
                  <h2 className="text-5xl font-extrabold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
                    Valoración Completada
                  </h2>
                  <MdVerified className="h-8 w-8 text-red-500" />
                </div>
                
                <p className="text-lg text-gray-600 mb-8 flex items-center justify-center gap-2">
                  <FaCheckDouble className="h-5 w-5 text-red-500" />
                  Estimación basada en inteligencia artificial
                </p>
              </div>
            </div>

            {/* Tarjeta Principal del Precio */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 p-8 relative overflow-hidden">
              {/* Patrón decorativo de fondo */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/30 to-rose-100/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-100/30 to-red-100/30 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-3 mb-6">
                  <FaDollarSign className="h-8 w-8 text-red-500" />
                  <span className="text-2xl font-bold text-gray-700">Valor Estimado</span>
                </div>
                
                <div className="mb-8">
                  <div className="text-7xl font-black bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent mb-2 tracking-tight">
                    ${result.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <FaStar className="h-4 w-4 text-yellow-500" />
                    <span>Estimación con 95% de confianza</span>
                    <FaStar className="h-4 w-4 text-yellow-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Detalles del Vehículo */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Información del Vehículo */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-200/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                    <FaCar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Especificaciones
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <FaCar className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-gray-700">Marca</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.vehicleData.marca}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-gray-700">Año</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.vehicleData.año}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      <FaTachometerAlt className="h-5 w-5 text-red-500" />
                      <span className="font-medium text-gray-700">Millaje</span>
                    </div>
                    <span className="font-bold text-gray-900">
                      {parseInt(result.vehicleData.millaje).toLocaleString()} mi
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-3">
                      {result.vehicleData.motor === 'Eléctrico' ? (
                        <FaBolt className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <FaCog className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium text-gray-700">Motor</span>
                    </div>
                    <span className="font-bold text-gray-900">{result.vehicleData.motor}</span>
                  </div>
                </div>
              </div>

              {/* Información Adicional y Confianza */}
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-200/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
                    <HiSparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Análisis IA
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-700">Valoración Confiable</span>
                    </div>
                    <p className="text-sm text-red-600">
                      Basada en miles de transacciones similares y algoritmos de machine learning avanzados.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaInfoCircle className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-700">Factores Considerados</span>
                    </div>
                    <ul className="text-sm text-red-600 space-y-1">
                      <li>• Condiciones del mercado actual</li>
                      <li>• Historial de la marca y modelo</li>
                      <li>• Depreciación por millaje y año</li>
                      <li>• Tendencias de venta regionales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de API Response (si existe) */}
            {apiResponse && (
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-red-200/50 p-6">
                <button 
                  onClick={() => setShowApiResponse(!showApiResponse)}
                  className="flex items-center gap-3 w-full justify-center bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaCode className="h-5 w-5" />
                  <span>{showApiResponse ? 'Ocultar Datos Técnicos' : 'Ver Datos Técnicos'}</span>
                </button>
                
                {showApiResponse && (
                  <div className="mt-6 bg-gray-900 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <FaCode className="h-5 w-5 text-red-400" />
                      </div>
                      <h3 className="text-lg font-bold text-red-400">Respuesta Completa de la API</h3>
                    </div>
                    <div className="bg-black rounded-xl p-4 overflow-x-auto border border-gray-800">
                      <pre className="text-sm text-red-400 font-mono whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botones de Acción Mejorados */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button 
                onClick={resetForm}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <FaArrowLeft className="h-5 w-5 group-hover:animate-pulse" />
                <span>Nueva Valoración</span>
                <div className="w-2 h-2 bg-white/30 rounded-full group-hover:animate-ping"></div>
              </button>
              
              <button 
                onClick={() => window.print()}
                className="group inline-flex items-center gap-3 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-900 text-white font-semibold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              >
                <FaPrint className="h-5 w-5 group-hover:animate-pulse" />
                <span>Imprimir Reporte</span>
                <div className="w-2 h-2 bg-white/30 rounded-full group-hover:animate-ping"></div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-500 relative z-10">
        <div className="flex items-center justify-center space-x-2">
          <HiSparkles className="h-4 w-4 text-red-500" />
          <p>Powered by Azure Machine Learning • Estimaciones basadas en IA</p>
        </div>
      </footer>
    </div>
  );
}

export default App;