import React, { useState, useEffect, useRef } from 'react';

const Plantilla2Dom1 = () => {
  const [userWavelength, setUserWavelength] = useState('');
  const [userDistance, setUserDistance] = useState('');
  const [isWavelengthCorrect, setIsWavelengthCorrect] = useState(null);
  const [isDistanceCorrect, setIsDistanceCorrect] = useState(null);
  const epsilon = 0.05;
  const [hintIndexWavelength, setHintIndexWavelength] = useState(0);
  const [hintIndexDistance, setHintIndexDistance] = useState(0);
  const [showNextTaskButton, setShowNextTaskButton] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

 
  const [hintIndex, setHintIndex] = useState(0);
  const [frequency, setFrequency] = useState(0);
  const [speedOfSound, setSpeedOfSound] = useState(0);

  const [errorWavelength, setErrorWavelength] = useState('');
  const [errorDistance, setErrorDistance] = useState('');
  const [hintWavelength, setHintWavelength] = useState('');
  const [hintDistance, setHintDistance] = useState('');


  const hintsWavelength = [
    'La longitud de onda (λ) de una onda se relaciona con la velocidad de la onda (v) y la frecuencia (f) mediante una fórmula fundamental. ¿Puedes recordar cuál es esa fórmula y cómo se despeja λ? ',
    'La fórmula fundamental que relaciona la velocidad de una onda (v), la longitud de onda (λ), y la frecuencia (f) es: λ = v / f.',
  ];

  const hintsDistance = [
    'Para lograr la interferencia constructiva, necesitas asegurarte de que las ondas de los altavoces estén en fase, es decir, que las crestas de las ondas coincidan. ¿Recuerdas la fórmula para calcular la distancia entre dos puntos en una onda en fase? Esta fórmula implica la longitud de onda (λ) y el número entero (n)',
    'Recuerda la formula  D = (n * λ) / 2',
  ];

  useEffect(() => {
    const randomFrequency = Math.random() * (1000 - 20) + 20; 
    const randomSpeedOfSound = Math.random() * (400 - 300) + 300; 
    setFrequency(randomFrequency);
    setSpeedOfSound(randomSpeedOfSound);
  }, []);


  const calculateWavelength = () => {
    const wavelength = speedOfSound / frequency;
    return wavelength;
  };


  const calculateSpeakerDistance = () => {

    const n = 1;
    const wavelength = calculateWavelength();
    const distance = (n * wavelength) / 2;
    return distance;
  };

  const checkWavelength = () => {
   
    const userWavelengthFloat = parseFloat(userWavelength);
  

    const calculatedWavelength = calculateWavelength();
  
    
    const isCorrect = Math.abs(userWavelengthFloat - calculatedWavelength) < epsilon;
  
    if (isCorrect) {
      setIsWavelengthCorrect(true);
      setErrorWavelength('');
    } else {
      setIsWavelengthCorrect(false);
      setErrorWavelength('El valor de longitud de onda es incorrecto.');
      
      setHintIndexWavelength(hintIndexWavelength + 1); 
      setHintWavelength(hintsWavelength[hintIndexWavelength]);
    }
  };
  
  const checkDistance = () => {
   
    const userDistanceFloat = parseFloat(userDistance);
  
   
    const calculatedDistance = calculateSpeakerDistance();
  
    
    const isCorrect = Math.abs(userDistanceFloat - calculatedDistance) < epsilon;
  
    if (isCorrect) {
      setIsDistanceCorrect(true);
      setErrorDistance('');
    } else {
      setIsDistanceCorrect(false);
      setErrorDistance('El valor de distancia es incorrecto.');
    
      setHintIndexDistance(hintIndexDistance + 1);
      setHintDistance(hintsDistance[hintIndexDistance]);
    }
  };

  const renderHint = () => {
    
    if (!isWavelengthCorrect && !isDistanceCorrect) {
      return (
        <div className="bg-yellow-100 rounded p-4 mt-2">
          <div className="text-red-500">{errorWavelength}</div>
          <div className="text-red-500">{hintWavelength}</div>
          <br></br>
          <div className="text-red-500">{errorDistance}</div>
          <div className="text-red-500">{hintDistance}</div>
        </div>
      );
    } else if (!isWavelengthCorrect) {
      return (
        <div className="bg-yellow-100 rounded p-4 mt-2">
          <div className="text-red-500">{errorWavelength}</div>
          <div className="text-red-500">{hintWavelength}</div>
        </div>
      );
    } else if (!isDistanceCorrect) {
      return (
        <div className="bg-yellow-100 rounded p-4 mt-2">
          <div className="text-red-500">{errorDistance}</div>
          <div className="text-red-500">{hintDistance}</div>
        </div>
      );
    } else {
      return null;
    }
  };
  const canvasRef = useRef(null);


  const drawDiagram = () => {
    console.log("entra");
    if (canvasRef) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
  
  
      const canvasWidth = 800;
      const canvasHeight = 250; 
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
  
       
      const distance = parseFloat(userDistance) || 0;
      const wavelength = calculateWavelength();
  
      const scale = canvasWidth / 600; 
      ctx.font = `${20 * scale}px Arial`;
  

      ctx.fillStyle = 'black';

      ctx.font = `${10 * scale}px Arial`;
      ctx.fillText('Altavoz A', 5 * scale, (canvasHeight / 2 + 50) * scale);
      ctx.fillText('Altavoz B', (50 + distance * 10) * scale, (canvasHeight / 2 + 50) * scale);
      ctx.beginPath();
      ctx.lineTo((50 + distance * 10) * scale, (canvasHeight / 2) * scale);
      ctx.stroke();
      const textY = (canvasHeight / 2 + 50) * scale;
     
      ctx.fillStyle = 'blue';
      ctx.fillRect(40 * scale, (canvasHeight / 2 - 20) * scale, (10 * scale), (40 * scale));
      ctx.fillStyle = 'red';
      ctx.fillRect((50 + distance * 10 - 10) * scale, (canvasHeight / 2 - 20) * scale, (10 * scale), (40 * scale));
  
      const lineY = (canvasHeight / 2 + 60) * scale;
      ctx.beginPath();
      ctx.moveTo(30 * scale, lineY);
      ctx.lineTo((70 + distance * 10) * scale, lineY);
      ctx.strokeStyle = 'black';
      ctx.stroke();
      ctx.fillStyle = 'black';
ctx.fillText(`D = ${userDistance}`, 75 * scale, textY);
  
    
      const numWaves = 5;
      const waveSpacing = wavelength / 2; 
      const yOffset = (12 * scale); 
  
      for (let i = 0; i < numWaves; i++) {
        const xA = (55 * scale);
        const xB = (55 + distance * 10) * scale; 
        const y = (canvasHeight / 2 - yOffset * (i + 1)) * scale;
  
        ctx.beginPath();
        ctx.moveTo(xA, y);
        ctx.lineTo((xA + wavelength * 16 * scale), y);
        ctx.strokeStyle = 'blue';
        ctx.stroke();
  
      
        ctx.beginPath();
        ctx.moveTo(xB, y);
        ctx.lineTo((xB + wavelength * 16 * scale), y);
        ctx.strokeStyle = 'red';
        ctx.stroke();
  
        const labelX = (xA + (distance / 2) * 10 * scale) - (5 * scale);
        ctx.fillStyle = 'orange';
        ctx.fillText(`n=${i + 1}`, labelX, y - (5 * scale));
  
        ctx.beginPath();
        ctx.moveTo((xA + i * waveSpacing * 16 * scale), y);
        ctx.lineTo((xA + (i + 1) * waveSpacing * 10 * scale), y);
        ctx.strokeStyle = 'green';
        ctx.stroke();
      }
    }
  };
  
  
  const check = () => {
    console.log("entra");
    localStorage.setItem('resultados', JSON.stringify('correcto'));
    localStorage.setItem('ultimaTarea', 'calculo');
    localStorage.setItem('cambio', 'si');

  };
  
  

  useEffect(() => {
    drawDiagram(); 
  }, [userDistance, userWavelength]);

  return (
    <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center">
      <br></br>
      <h1 className="text-3xl font-semibold mb-4 text-blue-800">✏️ Pregunta de cálculo ✏️</h1>

      <div className="bg-blue-200 text-lg text-blue-800 mx-4 p-4 rounded-lg">
        Un ingeniero acústico está diseñando un sistema de altavoces para un teatro. Para lograr una experiencia de audio óptima, necesita determinar la longitud de onda (λ) de un tono de audio fundamental de {frequency.toFixed(2)} Hz en una sala con una velocidad del sonido (v) de {speedOfSound.toFixed(2)} m/s. Además, el ingeniero desea calcular la distancia entre dos altavoces para crear un patrón de interferencia constructiva en el que el sonido sea más fuerte. Si desea que la interferencia constructiva ocurra para este tono de {frequency.toFixed(2)} Hz, ¿cuál debe ser la distancia entre los altavoces?

        Utiliza los conceptos relacionados con la velocidad del sonido, la longitud de onda y la interferencia constructiva de las ondas para calcular la longitud de onda del tono de {frequency.toFixed(2)} Hz y la distancia entre los altavoces necesaria para lograr la interferencia constructiva en este tono específico.
      </div>
      <canvas
        ref={canvasRef}
        width={600} 
        height={300} 
        style={{ border: '1px solid black' }}
      ></canvas>

      <br></br>

<div className="mt-4">
      <h2 className="text-2xl font-semibold mb-2 text-blue-800">Definiciones:</h2>
      <p className="text-blue-500">
        <span className="text-red-500">🔴 Líneas Rojas:</span> Representan las ondas de sonido emitidas por el Altavoz A.
      </p>
      <p className="text-blue-500">
        <span className="text-blue-500">🔵 Líneas Azules:</span> Representan las ondas de sonido emitidas por el Altavoz B.
      </p>
      <p className="text-blue-500">
        <span className="text-green-500">🟢 Líneas Verdes:</span> Representan las líneas de interferencia constructiva entre las ondas de Altavoz A y Altavoz B.
      </p>
      <p className="text-blue-500">
        <span className="text-purple-500">"n" (números):</span> Representan el número de onda, que indica el orden de interferencia constructiva.
      </p>
      <p className="text-blue-500">Ingresa valores en los campos de Longitud de Onda y Distancia entre los altavoces para modificar el gráfico.</p>
    <br></br>
    </div>
      <div className="text-lg text-blue-800">
        <div className="flex items-center">
          <label htmlFor="wavelengthInput" className="mr-2">Longitud de Onda (metros):</label>
          <input
            id="wavelengthInput"
            className={`bg-purple-100 rounded p-2 ${isWavelengthCorrect === false ? 'border-red-500' : ''}`}
            type="number"
            value={userWavelength}
            onChange={(e) => setUserWavelength(parseFloat(e.target.value))}
            onBlur={checkWavelength}
          />
        </div>
      </div>

      <br></br>
      <div className="text-lg text-blue-800">
        <div className="flex items-center">
          <label htmlFor="distanceInput" className="mr-2">Distancia entre los altavoces (metros):</label>
          <input
            id="distanceInput"
            className={`bg-purple-100 rounded p-2 ${isDistanceCorrect === false ? 'border-red-500' : ''}`}
            type="number"
            value={userDistance}
            onChange={(e) => setUserDistance(parseFloat(e.target.value))}
            onBlur={checkDistance}
          />
        </div>
      </div>

      {showSubmitButton && (
        <button className="bg-purple-200 rounded-full px-4 py-2 mt-4 text-blue-400" onClick={() => {}}>
          Entregar respuesta
        </button>
      )}
      {isWavelengthCorrect === true && isDistanceCorrect === true && (
        <div>
          <p className="text-lg text-green-500">Tus respuestas son correctas.</p>
          {showNextTaskButton && (
            <button className={'bg-purple-200 rounded-full px-4 py-2 mt-4'} onClick={check()}>
              Siguiente tarea
            </button>
            
          )}
        </div>
      )}
      {renderHint()}
    </div>
  );
};

export default Plantilla2Dom1;
