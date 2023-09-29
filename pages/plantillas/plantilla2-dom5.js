import React, { useState, useEffect } from 'react';
import React from 'react';
const Plantilla2Dom5 = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [machNumber, setMachNumber] = useState(0); // Número de Mach del cohete
  const [altitude, setAltitude] = useState(0); // Altitud aleatoria en metros
  const [staticPressure, setStaticPressure] = useState(0); // Presión estática en kPa
  const [temperature, setTemperature] = useState(0); // Temperatura en °C
  const epsilon = 0.01;

  const hints = [
    'Para calcular la densidad del aire, puedes utilizar la ecuación de estado del gas ideal. Asegúrate de convertir la temperatura a Kelvin antes de realizar los cálculos.',
    'La ecuación de estado del gas ideal es: densidad = (presión estática) / (constante de gas * temperatura).'
  ];

  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  // Generar valores aleatorios para la altitud y número de Mach
  const generateRandomValues = () => {
    // Generar una altitud aleatoria entre 11,500 y 17,000 metros
    const randomAltitude = Math.floor(Math.random() * (17000 - 11500 + 1)) + 11500;

    // Generar un número de Mach aleatorio entre 1 y 5
    const randomMachNumber = (Math.random() * 4) + 1;

    // Calcular la presión estática y la temperatura en función de Mach y altitud (fórmulas hipotéticas)
    const pressureConstant = 101.3; // Constante hipotética para la presión
    const temperatureConstant = -0.0065; // Constante hipotética para la temperatura
    const staticPressureValue = pressureConstant * Math.exp(-randomAltitude / 5000) * Math.pow(randomMachNumber, 2.5);
    const temperatureValue = 15 + temperatureConstant * randomAltitude;

    setAltitude(randomAltitude);
    setMachNumber(randomMachNumber);
    setStaticPressure(staticPressureValue);
    setTemperature(temperatureValue);
  };

  // Generar una pregunta aleatoria
  const generateRandomQuestion = () => {
    generateRandomValues();
  };

  // Restablecer el hint actual al generar una nueva pregunta
  useEffect(() => {
    setCurrentHintIndex(0);
    setIncorrectAttempts(0);
    generateRandomQuestion();
  }, []);

  // Calcular la densidad del aire cuando cambien las dependencias
  useEffect(() => {
    // Convertir temperatura a Kelvin
    const temperatureKelvin = temperature + 273.15;

    // Constante de gas para el aire en J/(kg·K)
    const gasConstant = 287.05;

    // Calcular la densidad del aire utilizando la ecuación de estado del gas ideal
    const density = (staticPressure * 1000) / (gasConstant * temperatureKelvin);

    // Establecer el valor calculado en el estado
    setCorrectAnswer(density.toFixed(2));
    setCurrentHintIndex(0); // Restablecer el índice del hint
    setIncorrectAttempts(0); // Restablecer el número de intentos incorrectos
    setIsCorrect(null); // Reiniciar la respuesta correcta
  }, [staticPressure, temperature]);

  const viewBoxHeight = 400; // Altura del cuadro del dibujo
  const maxHeight = 28000; // Altura máxima
  const minHeight = 11500; // Altura mínima
  const rocketHeight = 80; // Altura del cohete
  const scaleFactor = viewBoxHeight / (maxHeight - minHeight); // Factor de escala

  // Calcular las coordenadas del cohete y la línea de altitud ajustadas según la altitud
  const rocketY = viewBoxHeight - (altitude - minHeight) * scaleFactor - rocketHeight;
  const altitudeLineY1 = viewBoxHeight;
  const altitudeLineY2 = rocketY + rocketHeight / 2;

  // Función para calcular la densidad del aire
  const calculateDensity = () => {
    // Convertir temperatura a Kelvin
    const temperatureKelvin = temperature + 273.15;

    // Constante de gas para el aire en J/(kg·K)
    const gasConstant = 287.05;

    // Calcular la densidad del aire utilizando la ecuación de estado del gas ideal
    const density = (staticPressure * 1000) / (gasConstant * temperatureKelvin);

    return density.toFixed(2);
  };

  // Función para verificar la respuesta del usuario
  const checkAnswer = () => {
    const userAnswerFloat = parseFloat(userAnswer);
    const correctAnswerFloat = parseFloat(correctAnswer);
    let isAnswerCorrect = false;

    // Comprobar si la respuesta del usuario está dentro del margen de error epsilon
    if (!isNaN(userAnswerFloat) && Math.abs(userAnswerFloat - correctAnswerFloat) < epsilon) {
      isAnswerCorrect = true;
      localStorage.setItem('resultados', JSON.stringify('correcto'));
      localStorage.setItem('ultimaTarea', 'calculo');
      localStorage.setItem('cambio', 'si');
    } else {
      // Respuesta incorrecta
      setIncorrectAttempts(incorrectAttempts + 1);
      setCurrentHintIndex(Math.min(incorrectAttempts, hints.length - 1));
    }

    setIsCorrect(isAnswerCorrect);

    // Mostrar la respuesta correcta en la consola
    console.log(`Respuesta correcta: ${correctAnswer}`);
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Problema de Densidad del Aire ✏️</h1>

      <br />

      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
        {/* Mostrar la pregunta */}
        <p>
          Un ingeniero aeroespacial está trabajando en un diseño de un cohete que viajará a una velocidad supersónica. El cohete tiene una velocidad de Mach {machNumber.toFixed(2)} y está a una altitud de {altitude} metros sobre el nivel del mar. La presión estática en esa altitud es de {staticPressure.toFixed(2)} kPa, y la temperatura ambiente es de {temperature.toFixed(2)}°C. Calcula la densidad del aire a esta altitud y temperatura.
        </p>
      </div>

      {/* Dibujo del cohete y valores */}
      <svg width="400" height={viewBoxHeight} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 400 ${viewBoxHeight}`}>
        {/* Fondo que representa la atmósfera */}
        <rect x="0" y="0" width="400" height={viewBoxHeight} fill="#87CEEB" />

        {/* Mar */}
        <rect x="0" y={viewBoxHeight - 50} width="400" height="50" fill="blue" />

        {/* Línea de altitud que va desde el mar hasta el cohete */}
        <line x1="165" y1={altitudeLineY1} x2="165" y2={altitudeLineY2} stroke="black" strokeWidth="2" />

        {/* Cohete */}
        <rect x="150" y={rocketY} width="30" height={rocketHeight} fill="gray" />

        {/* Líneas de velocidad supersónica (ondas de choque) */}
        <line x1="160" y1={rocketY} x2="130" y2={rocketY - 30} stroke="red" strokeWidth="2" />
        <line x1="170" y1={rocketY} x2="140" y2={rocketY - 30} stroke="red" strokeWidth="2" />

        {/* Escala de altitud */}
        <text x="75" y={altitudeLineY1 - 10} fill="orange">Altura: {altitude} m</text>

        {/* Valores de presión estática y temperatura */}
        <text x="10" y="30" fill="black">Presión Estática: {staticPressure.toFixed(2)} kPa</text>
        <text x="10" y="50" fill="black">Temperatura: {temperature.toFixed(2)}°C</text>

        {/* Valor de densidad */}
        <text x="10" y={altitudeLineY2 + 20} fill="yellow">Densidad: {isCorrect === true ? calculateDensity() : "?"} kg/m³</text>
      </svg>

      <br />

      <div className="text-lg text-blue-800">
        {/* Mostrar el input para la respuesta */}
        <div>
          <p>Introduce la densidad del aire (kg/m³):</p>
          <div className="flex items-center">
            <input
              className="bg-purple-100 rounded p-2"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <span className="ml-2">kg/m³</span>
          </div>
          {/* Mostrar la pista si la respuesta es incorrecta */}
          {isCorrect === false && hints[currentHintIndex] && (
            <div className="bg-yellow-100 rounded p-4 mt-2">
              <div className="text-red-500">{hints[currentHintIndex]}</div>
            </div>
          )}
        </div>

        {/* Mostrar el botón para enviar la respuesta */}
        <button
          className="bg-purple-200 rounded-full px-4 py-2 mt-4 text-blue-400"
          onClick={checkAnswer}
        >
          Enviar respuesta
        </button>

        {/* Mostrar la retroalimentación */}
        {isCorrect !== null && (
          <p className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Plantilla2Dom5;
