// Cuestionario.jsx
import React, { useState } from 'react';
import { cuestionarioData } from './preguntas';

export default function Cuestionario() {
  // Estados de la aplicación
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [puntaje, setPuntaje] = useState(0);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  // Desestructuramos la información de la pregunta en la que vamos
  const { pregunta, opciones, respuestaCorrecta } = cuestionarioData[preguntaActual];

  const handleSeleccionarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
  };

  const handleSiguientePregunta = () => {
    // Validar si la respuesta es correcta antes de avanzar
    if (opcionSeleccionada === respuestaCorrecta) {
      setPuntaje(puntaje + 1);
    }

    const siguienteIndex = preguntaActual + 1;

    if (siguienteIndex < cuestionarioData.length) {
      // Avanzar a la siguiente pregunta y limpiar la selección anterior
      setPreguntaActual(siguienteIndex);
      setOpcionSeleccionada('');
    } else {
      // Si ya no hay más preguntas, mostrar la pantalla final
      setMostrarResultado(true);
    }
  };

  const reiniciarCuestionario = () => {
    setPreguntaActual(0);
    setOpcionSeleccionada('');
    setPuntaje(0);
    setMostrarResultado(false);
  };

  // Pantalla final de resultados
  if (mostrarResultado) {
    return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h2>¡Cuestionario Finalizado!</h2>
        <p>Tu puntaje final es: <strong>{puntaje} de {cuestionarioData.length}</strong></p>
        <button 
          onClick={reiniciarCuestionario}
          style={{ padding: '10px 20px', cursor: 'pointer', marginTop: '15px' }}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Interfaz de las preguntas
  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      {/* Progreso actual */}
      <span style={{ fontSize: '14px', color: '#666' }}>
        Pregunta {preguntaActual + 1} de {cuestionarioData.length}
      </span>
      
      <h3 style={{ marginTop: '10px', marginBottom: '20px' }}>{pregunta}</h3>

      {/* Lista de opciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {opciones.map((opcion, index) => {
          const esSeleccionada = opcionSeleccionada === opcion;
          return (
            <button
              key={index}
              onClick={() => handleSeleccionarOpcion(opcion)}
              style={{
                padding: '12px',
                textAlign: 'left',
                backgroundColor: esSeleccionada ? '#e0f0ff' : '#f5f5f5',
                border: esSeleccionada ? '2px solid #007bff' : '1px solid #ccc',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: esSeleccionada ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {opcion}
            </button>
          );
        })}
      </div>

      {/* Botón para continuar */}
      <button
        onClick={handleSiguientePregunta}
        disabled={!opcionSeleccionada}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: opcionSeleccionada ? '#007bff' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: opcionSeleccionada ? 'pointer' : 'not-allowed',
          fontWeight: 'bold'
        }}
      >
        Continuar
      </button>
    </div>
  );
}