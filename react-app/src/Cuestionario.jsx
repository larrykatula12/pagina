import React, { useState } from 'react';
import { cuestionarioData } from './preguntas';
import { guardarRespuestasEnFirebase } from './firebase-config';
import './Cuestionario.css';

export default function Cuestionario() {
  const [fase, setFase] = useState('inicio');
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState('');
  const [textoOtro, setTextoOtro] = useState('');
  const [respuestas, setRespuestas] = useState([]);
  const [errorServidor, setErrorServidor] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [key, setKey] = useState(0);

  const { pregunta, opciones } = cuestionarioData[preguntaActual];
  const esPreguntaNombre = preguntaActual === 0;
  const esOpcionConTexto = opcionSeleccionada === 'Otra cosa' || opcionSeleccionada === 'Especifica otra hora';

  const handleSeleccionarOpcion = (opcion) => {
    setOpcionSeleccionada(opcion);
    setTextoOtro('');
  };

  const enviarRespuestasAlServidor = async (nuevasRespuestas) => {
    setGuardando(true);
    try {
      await guardarRespuestasEnFirebase(nuevasRespuestas);
      console.log('Respuestas guardadas exitosamente en Firebase');
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrorServidor('Error al guardar las respuestas. Por favor intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleSiguientePregunta = async () => {
    const siguienteIndex = preguntaActual + 1;
    const nuevaRespuesta = {
      pregunta,
      respuesta: opcionSeleccionada,
      detalle: esOpcionConTexto ? textoOtro : '',
    };
    const siguientesRespuestas = [...respuestas, nuevaRespuesta];

    if (siguienteIndex < cuestionarioData.length) {
      setRespuestas(siguientesRespuestas);
      setPreguntaActual(siguienteIndex);
      setOpcionSeleccionada('');
      setTextoOtro('');
      setKey(prev => prev + 1);
    } else {
      setRespuestas(siguientesRespuestas);
      await enviarRespuestasAlServidor(siguientesRespuestas);
      setFase('resultado');
      setKey(prev => prev + 1);
    }
  };

  const reiniciarCuestionario = () => {
    setFase('inicio');
    setPreguntaActual(0);
    setOpcionSeleccionada('');
    setTextoOtro('');
    setRespuestas([]);
    setKey(prev => prev + 1);
  };

  const iniciarParticipacion = (participa) => {
    if (participa) {
      setFase('mensaje');
    } else {
      setFase('no');
    }
    setKey(prev => prev + 1);
  };

  const comenzarCuestionario = () => {
    setFase('cuestionario');
    setPreguntaActual(0);
    setOpcionSeleccionada('');
    setTextoOtro('');
    setRespuestas([]);
    setKey(prev => prev + 1);
  };

  if (fase === 'inicio') {
    return (
      <div key={key} className="cuestionario-container intro-container">
        <div style={{ fontSize: '48px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>
          💕
        </div>
        <h2 className="pregunta-titulo">¿Quieres salir conmigo?</h2>
        <div className="intro-buttons">
          <button className="opcion-button" onClick={() => iniciarParticipacion(true)}>
            ✨ Sí
          </button>
          <button className="opcion-button" onClick={() => iniciarParticipacion(false)}>
            Claro que sí
          </button>
        </div>
      </div>
    );
  }

  if (fase === 'mensaje') {
    return (
      <div key={key} className="cuestionario-container intro-container">
        <div style={{ fontSize: '56px', marginBottom: '20px', animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          🎉
        </div>
        <h2 className="pregunta-titulo">¡Adelante!</h2>
        <p className="resultado-texto">Responde estas preguntas de forma sencilla y disfruta el cuestionario.</p>
        <button onClick={comenzarCuestionario} className="continuar-button">
          🚀 Comenzar cuestionario
        </button>
      </div>
    );
  }

  if (fase === 'no') {
    return (
      <div key={key} className="cuestionario-container resultado-container">
        <div style={{ fontSize: '56px', marginBottom: '20px', animation: 'scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
          😄
        </div>
        <h2 className="resultado-titulo">Está bien, vamos a salir igualmente</h2>
        <p className="resultado-texto">Responde estas preguntas de forma sencilla y disfruta el cuestionario.</p>
        <button onClick={comenzarCuestionario} className="continuar-button">
          🚀 Comenzar cuestionario
        </button>
      </div>
    );
  }

  if (fase === 'resultado') {
    return (
      <div key={key} className="cuestionario-container resultado-container">
        <div style={{ fontSize: '64px', marginBottom: '20px', animation: 'float 3s ease-in-out infinite' }}>
          🎊
        </div>
        <h2 className="resultado-titulo">¡Muchas gracias por aceptar!</h2>
        <p className="resultado-texto">Se te informara sobre los detalles del evento en el corto plazo.</p>
        <p className="resultado-texto">
          ✅ Tus respuestas fueron enviadas y guardadas en el servidor.
        </p>
        {errorServidor && (
          <p className="resultado-error">⚠️ {errorServidor}</p>
        )}
        <button onClick={reiniciarCuestionario} className="reintentar-button">
          🔄 Regresar al inicio
        </button>
      </div>
    );
  }

  return (
    <div key={key} className="cuestionario-container">
      <div className="progreso-container">
        <span className="progreso-texto">
          Pregunta {preguntaActual + 1} de {cuestionarioData.length}
        </span>
        <div className="progreso-bar">
          <div
            className="progreso-fill"
            style={{ width: `${((preguntaActual + 1) / cuestionarioData.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="pregunta-titulo">{pregunta}</h3>

      {esPreguntaNombre ? (
        <div className="input-otra-opcion">
          <label htmlFor="nombreUsuario" className="input-label">
            👤 Agregar nombre
          </label>
          <input
            id="nombreUsuario"
            type="text"
            value={opcionSeleccionada}
            onChange={(e) => setOpcionSeleccionada(e.target.value)}
            placeholder="Escribe tu nombre..."
            className="texto-otro-input"
          />
        </div>
      ) : (
        <div className="opciones-container">
          {opciones.map((opcion, index) => {
            const esSeleccionada = opcionSeleccionada === opcion;
            return (
              <button
                key={index}
                onClick={() => handleSeleccionarOpcion(opcion)}
                className={`opcion-button ${esSeleccionada ? 'seleccionada' : ''}`}
              >
                {opcion}
              </button>
            );
          })}
        </div>
      )}

      {esOpcionConTexto && (
        <div className="input-otra-opcion">
          <label htmlFor="textoOtro" className="input-label">
            {opcionSeleccionada === 'Otra cosa'
              ? '🍽️ Escribe qué quieres comer:'
              : '⏰ Especifica la hora:'}
          </label>
          <input
            id="textoOtro"
            type="text"
            value={textoOtro}
            onChange={(e) => setTextoOtro(e.target.value)}
            placeholder={opcionSeleccionada === 'Otra cosa' ? 'Escribe otra opción...' : 'Escribe la hora...'}
            className="texto-otro-input"
          />
        </div>
      )}

      <button
        onClick={handleSiguientePregunta}
        disabled={!opcionSeleccionada || (esOpcionConTexto && !textoOtro.trim()) || guardando}
        className="continuar-button"
      >
        {guardando ? '⏳ Guardando...' : '➡️ Continuar'}
      </button>
    </div>
  );
}
