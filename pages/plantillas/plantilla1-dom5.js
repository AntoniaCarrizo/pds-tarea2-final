import React, { useState, useEffect } from 'react';
import React from 'react';
const Plantilla1Dom5 = () => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [machNumber, setMachNumber] = useState(2); 
  const [speedOfSound, setSpeedOfSound] = useState(300);
  const [altitude, setAltitude] = useState(0);
  const [staticPressure, setStaticPressure] = useState(0); 
  const epsilon = 0.01;

  const hints = [
    'Para calcular la presión total en el frente de onda de choque, puedes utilizar la relación de presiones en ondas de choque. Esta relación implica la relación entre la presión estática, la presión total y el Mach Number. Investiga esta fórmula y cómo se relaciona con el problema.',
    'El Mach Number (Mach) es una medida de la velocidad de un objeto en relación con la velocidad del sonido en un medio particular. En este caso, el avión vuela a Mach 2, lo que significa que su velocidad es el doble de la velocidad del sonido en ese medio. Utiliza esta información para calcular la velocidad del avión.',
  ];

  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);


  const generateRandomValues = () => {
   
    const randomAltitude = Math.floor(Math.random() * (23000 - 10000 + 1)) + 10000;
  
  
    const randomStaticPressure = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
  
    setAltitude(randomAltitude);
    setStaticPressure(randomStaticPressure);
  };
  

  
  const generateRandomQuestion = () => {
    generateRandomValues();
  };


  useEffect(() => {
    setCurrentHintIndex(0);
    setIncorrectAttempts(0);
    generateRandomQuestion();
  }, []);

  
  useEffect(() => {
   
    const gamma = 1.4; 
    const pressureRatio = Math.pow(1 + ((gamma - 1) / 2) * Math.pow(machNumber, 2), gamma / (gamma - 1));
    const totalPressure = staticPressure * pressureRatio;

   
    setCorrectAnswer(totalPressure.toFixed(2));
    setCurrentHintIndex(0); 
    setIncorrectAttempts(0); 
    setIsCorrect(null); 
  }, [staticPressure, machNumber]);

  
  const airplaneX = 200; 
  const airplaneY = 250 - (altitude / 100); 

  const renderHint = () => {

    const hintToShow = hints[currentHintIndex];

    return (
      hintToShow && (
        <div className="bg-yellow-100 rounded p-4 mt-2">
          <div className="text-red-500">{hintToShow}</div>
        </div>
      )
    );
  };

  const checkAnswer = () => {
    const userAnswerFloat = parseFloat(userAnswer);
    const correctAnswerFloat = parseFloat(correctAnswer);
    let isAnswerCorrect = false;


    if (!isNaN(userAnswerFloat) && Math.abs(userAnswerFloat - correctAnswerFloat) < epsilon) {
      isAnswerCorrect = true;
      localStorage.setItem('resultados', JSON.stringify('correcto'));
      localStorage.setItem('ultimaTarea', 'calculo');
      localStorage.setItem('cambio', 'si');
    } else {

      setIncorrectAttempts(incorrectAttempts + 1);
      setCurrentHintIndex(Math.min(incorrectAttempts, hints.length - 1));
    }

    setIsCorrect(isAnswerCorrect);


    console.log(`Respuesta correcta: ${correctAnswer}`);
  };

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Problema de Ondas de Choque ✏️</h1>

      <br />

      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">

        <p>
          Un avión vuela a una velocidad supersónica de Mach 2 a una altitud de {altitude} metros sobre el nivel del mar. La presión estática en la altitud es de {staticPressure} kPa y la velocidad del sonido a esta altitud es de aproximadamente {speedOfSound} m/s. Calcula la presión total en el frente de onda de choque que se forma frente al avión.
        </p>
      </div>
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">

  <rect x="0" y="250" width="400" height="50" fill="blue" />


  <line x1={airplaneX} y1={airplaneY} x2="200" y2="250" stroke="black" strokeWidth="2" />


  <rect x={airplaneX - 20} y={airplaneY - 7.5} width="40" height="10" fill="red" />
  <polygon points={`${airplaneX}, ${airplaneY + 15} ${airplaneX + 20}, ${airplaneY + 15} ${airplaneX - 10}, ${airplaneY - 5} ${airplaneX + 10}, ${airplaneY - 5}`} fill="red" />


  <line x1={airplaneX +100} y1={airplaneY + 15} x2={airplaneX + 5} y2={airplaneY + 25} stroke="orange" strokeWidth="2" strokeDasharray="5,5" />

  <text x="10" y="40" fill="black">Altura: {altitude} m</text>
  <text x="10" y="60" fill="orange">Velocidad: Mach 2</text>

  <text x="10" y="80" fill="green">Presión estática: {staticPressure} kPa</text>
</svg>

      <br />

      <div className="text-lg text-blue-800">
       
        <div>
          <p>Introduce la presión total en el frente de onda de choque (kPa):</p>
          <div className="flex items-center">
            <input
              className="bg-purple-100 rounded p-2"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <span className="ml-2">kPa</span>
          </div>
         
          {isCorrect === false && renderHint()}
        </div>

        
        <button
          className="bg-purple-200 rounded-full px-4 py-2 mt-4 text-blue-400"
          onClick={checkAnswer}
        >
          Enviar respuesta
        </button>

      
        {isCorrect !== null && (
          <p className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? 'Respuesta correcta' : 'Respuesta incorrecta'}
          </p>
        )}
      </div>
    </div>
  );
};

export default Plantilla1Dom5;
