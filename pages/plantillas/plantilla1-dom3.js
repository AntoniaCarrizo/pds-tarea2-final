import React, { useState, useEffect } from 'react';
import React from 'react';
const Plantilla1Dom3 = () => {
  const [property, setProperty] = useState(0); 
  const [variable1, setVariable1] = useState(0); 
  const [variable2, setVariable2] = useState(0); 
  const [variable3, setVariable3] = useState(0); 
  const [userAnswerSpeed, setUserAnswerSpeed] = useState('');
  const [userAnswerDistance, setUserAnswerDistance] = useState('');
  const [isCorrectSpeed, setIsCorrectSpeed] = useState(null);
  const [isCorrectDistance, setIsCorrectDistance] = useState(null);
  const [correctAnswerSpeed, setCorrectAnswerSpeed] = useState(0);
  const [correctAnswerDistance, setCorrectAnswerDistance] = useState(0);
  const epsilon = 0.05;

  const [showNextTaskButton, setShowNextTaskButton] = useState(false);

  const hints = [
    [
      'Utiliza la fórmula que relaciona la velocidad del sonido con la temperatura y las propiedades del agua.',
      'Verifica si tienes las constantes necesarias para realizar el cálculo, como la relación de calores específicos del agua, la constante universal de los gases y la masa molar del agua',
    ],
    [
      'Ten en cuenta que la frecuencia del eco es diferente de la frecuencia emitida por el submarino',
      'Asegúrate de despejar la distancia en la fórmula y utiliza los valores conocidos para realizar el cálculo.',
    ],
  ];

  const [currentHintIndexSpeed, setCurrentHintIndexSpeed] = useState(0);
  const [currentHintIndexDistance, setCurrentHintIndexDistance] = useState(0);
  const [incorrectAttemptsSpeed, setIncorrectAttemptsSpeed] = useState(0);
  const [incorrectAttemptsDistance, setIncorrectAttemptsDistance] = useState(0);

  const generateRandomTemperature = () => {
    const minTemperature = 0; 
    const maxTemperature = 30; 
    const randomTemperature = Math.random() * (maxTemperature - minTemperature) + minTemperature;
    return randomTemperature.toFixed(2);
  };

  const generateRandomQuestion = () => {
   
    const randomFrequency = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
    const randomTemperature = generateRandomTemperature();
    const randomSpeedOfSound = Math.floor(Math.random() * (400 - 300 + 1)) + 300; 

    const temperatureInKelvin = parseFloat(randomTemperature) + 273.15; 
    const gamma = 1.4; 
    const universalGasConstant = 8.314; 
    const molarMassOfWater = 18.015; 
    const speedOfSoundInWater = Math.sqrt((gamma * universalGasConstant * temperatureInKelvin) / (molarMassOfWater / 1000));

    const distance = speedOfSoundInWater / (2 * (randomFrequency - randomSpeedOfSound));


    setVariable1(randomFrequency);
    setVariable2(randomSpeedOfSound);
    setVariable3(randomTemperature); 
    setCorrectAnswerSpeed(speedOfSoundInWater.toFixed(2));
    setCorrectAnswerDistance(distance.toFixed(2));
    setCurrentHintIndexSpeed(0); 
    setCurrentHintIndexDistance(0);
    setIncorrectAttemptsSpeed(0); 
    setIncorrectAttemptsDistance(0); 
    setIsCorrectSpeed(null); 
    setIsCorrectDistance(null); 
  };


  useEffect(() => {
    setCurrentHintIndexSpeed(0);
    setCurrentHintIndexDistance(0);
    setIncorrectAttemptsSpeed(0);
    setIncorrectAttemptsDistance(0);
    generateRandomQuestion();
  }, []);

  const renderHint = (property) => {

    const hintToShow =
      property === 0 ? hints[property][currentHintIndexSpeed] : hints[property][currentHintIndexDistance];

    return (
      hintToShow && (
        <div className="bg-yellow-100 rounded p-4 mt-2">
          <div className="text-red-500">{hintToShow}</div>
        </div>
      )
    );
  };

  const checkAnswer = () => {
    const userAnswerFloatSpeed = parseFloat(userAnswerSpeed);
    const correctAnswerFloatSpeed = parseFloat(correctAnswerSpeed);
    const userAnswerFloatDistance = parseFloat(userAnswerDistance);
    const correctAnswerFloatDistance = parseFloat(correctAnswerDistance);

    let isSpeedCorrect = false;
    let isDistanceCorrect = false;

  
    if (Math.abs(userAnswerFloatSpeed - correctAnswerFloatSpeed) < epsilon) {
      isSpeedCorrect = true;
    } else {
  
      setIncorrectAttemptsSpeed(incorrectAttemptsSpeed + 1);
      setCurrentHintIndexSpeed(Math.min(incorrectAttemptsSpeed, hints[0].length - 1));
    }

  
    if (Math.abs(userAnswerFloatDistance - correctAnswerFloatDistance) < epsilon) {
      isDistanceCorrect = true;
    } else {
     
      setIncorrectAttemptsDistance(incorrectAttemptsDistance + 1);
      setCurrentHintIndexDistance(Math.min(incorrectAttemptsDistance, hints[1].length - 1));
    }

    setIsCorrectSpeed(isSpeedCorrect);
    setIsCorrectDistance(isDistanceCorrect);
    if(isSpeedCorrect == true && isDistanceCorrect == true){
      localStorage.setItem('resultados', JSON.stringify('correcto'));
      localStorage.setItem('ultimaTarea', 'calculo');
      localStorage.setItem('cambio', 'si');
    }
  
    console.log('Respuesta correcta de velocidad:', correctAnswerFloatSpeed);
    console.log('Respuesta correcta de distancia:', correctAnswerFloatDistance);
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Pregunta de cálculo ✏️</h1>
  
      <br />
  
      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
     
        <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
       
          <p>
            Un submarino emite un sonido a una frecuencia de {variable1} Hz. Cuando el eco regresa, la frecuencia del eco es de {variable2} Hz. Si la temperatura del agua es de {variable3}°C, calcula la velocidad del sonido en el agua y la distancia entre el submarino y el fondo marino.
          </p>
        </div>
      </div>
      
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="350"
        height="350"
        viewBox="0 0 250 350"
        className="mt-4"
      >
       
        <rect x="50" y="100" width="100" height="30" fill="#003366" />
        <ellipse cx="100" cy="115" rx="50" ry="20" fill="#003366" />
        <line x1="100" y1="100" x2="100" y2="115" stroke="#003366" strokeWidth="2" />
        <text x="85" y="120" fill="white" fontSize="10" fontWeight="bold">
          Submarino
        </text>
  
      
        <line x1="100" y1="130" x2="100" y2={130 + ((variable1 - 300) / 300) * 30} stroke="orange" strokeWidth="2" />
        <text x="105" y={130 + ((variable1 - 300) / 300) * 30 + 5} fill="orange" fontSize="10">
          Sonido emitido ({variable1} Hz)
        </text>
   
        <line x1="105" y1={130 + ((variable1 - 300) / 300) * 30} x2="105" y2="100" stroke="red" strokeWidth="2" />
        <text x="105" y="65" fill="red" fontSize="10">
          Eco del sonido ({variable2} Hz)
        </text>
  
        <text x="10" y="195" fill="black" fontSize="10">
          Temperatura del agua: {variable3}°C
        </text>
  
        <line x1="100" y1="100" x2="100" y2="70" stroke="green" strokeWidth="2" />
        <text x="105" y="45" fill="green" fontSize="10">
          Distancia desconocida (d)
        </text>
      </svg>
  
      <br />
      <br />
      <div className="text-lg text-blue-800">
       
        <div>
          <p>Introduce la velocidad del sonido en el agua (m/s):</p>
          <div className="flex items-center">
            <input
              className="bg-purple-100 rounded p-2"
              type="number"
              value={userAnswerSpeed}
              onChange={(e) => setUserAnswerSpeed(e.target.value)}
            />
            <span className="ml-2">m/s</span>
          </div>
          
          {isCorrectSpeed === false && renderHint(0)}
        </div>
  
        <div>
          <p>Introduce la distancia entre el submarino y el fondo marino (m):</p>
          <div className="flex items-center">
            <input
              className="bg-purple-100 rounded p-2"
              type="number"
              value={userAnswerDistance}
              onChange={(e) => setUserAnswerDistance(e.target.value)}
            />
            <span className="ml-2">m</span>
          </div>
         
          {isCorrectDistance === false && renderHint(1)}
        </div>
  
        <button
          className="bg-purple-200 rounded-full px-4 py-2 mt-4 text-blue-400"
          onClick={checkAnswer}
        >
          Enviar respuesta
        </button>
  
        {isCorrectSpeed !== null || isCorrectDistance !== null ? (
          <p className={`text-lg ${isCorrectSpeed ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrectSpeed ? 'Velocidad correcta' : 'Velocidad incorrecta'},{' '}
            {isCorrectDistance ? 'Distancia correcta' : 'Distancia incorrecta'}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Plantilla1Dom3;
