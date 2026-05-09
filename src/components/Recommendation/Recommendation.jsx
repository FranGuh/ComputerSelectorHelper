import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import questions from '../../constants/questions'
import convertToSpecs from '../../utils/convertToSpecs'
import './Recommendation.css'
import LaptopCard from '../LaptopCard/LaptopCard'

import {
    FaMicrochip,
    FaMemory,
    FaHdd,
    FaLaptop,
    FaRegHandPointer,
    FaSuitcase,
    FaBatteryFull,
    FaWindows,
    FaExclamationTriangle,
    FaCheckCircle,
    FaClipboardList
} from 'react-icons/fa'



function Recommendation() {
    const loadSavedState = () => {
        try {
            const saved = localStorage.getItem('csh_quiz_state')
            if (saved) {
                const parsed = JSON.parse(saved)
                return {
                    answers: parsed.answers || {},
                    step: parsed.step || 0,
                    result: parsed.result || null,
                }
            }
        } catch {
            // ignore parse errors
        }
        return { answers: {}, step: 0, result: null }
    }

    const [answers, setAnswers] = useState(loadSavedState().answers)
    const [step, setStep] = useState(loadSavedState().step)
    const [result, setResult] = useState(loadSavedState().result)
    const [showWarnings, setShowWarnings] = useState(true)
    const [showRationale, setShowRationale] = useState(false)
    const [showApproximate, setShowApproximate] = useState(false)

    useEffect(() => {
        localStorage.setItem('csh_quiz_state', JSON.stringify({ answers, step, result }))
    }, [answers, step, result])

    const current = questions[step]

    const handleCheckboxChange = (questionId, value) => {
        if (answers[questionId] === 'full_use') {
            setAnswers(prev => ({
                ...prev,
                [questionId]: [value]
            }))
            return
        }

        const currentValues = Array.isArray(answers[questionId])
            ? answers[questionId]
            : []

        const isSelected = currentValues.includes(value)
        const maxSelections = current.maxSelections || Infinity

        let updatedValues
        if (isSelected) {
            updatedValues = currentValues.filter(v => v !== value)
        } else if (currentValues.length < maxSelections) {
            updatedValues = [...currentValues, value]
        } else {
            return
        }

        setAnswers(prev => ({
            ...prev,
            [questionId]: updatedValues
        }))
    }


    const handleRadioChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }))
    }

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(prev => prev + 1)
        } else {
            setResult(convertToSpecs(answers))
        }
    }

    const handleReset = () => {
        setAnswers({})
        setStep(0)
        setResult(null)
        localStorage.removeItem('csh_quiz_state')
    }

    if (result) {
        return (
            <div className="ResultContainer">
                <Helmet>
                    <title>Tu recomendación — Computer Selector Helper</title>
                    <meta name="description" content={`Tu recomendación: ${result.processor}, ${result.ram} RAM, ${result.gpu}. Modelos sugeridos incluidos.`} />
                    <meta property="og:title" content="Tu recomendación de laptop — Computer Selector Helper" />
                    <meta property="og:description" content={`Te recomendamos: ${result.processor}, ${result.ram} RAM, ${result.gpu}.`} />
                </Helmet>
                <h2>Tu recomendación técnica:</h2>
                <div className="ResultIntroCards">
                    <div className="InfoCard">
                        <div className="InfoCardHeader">
                            <FaCheckCircle className="InfoIcon" />
                            <h4 className="InfoLabel">Usos seleccionados</h4>
                        </div>
                        <p>
                            {answers.mainUse === 'full_use'
                                ? 'Uso exigente (todo lo anterior)'
                                : (answers.mainUse || []).map(u => {
                                    const label = questions[0].options.find(opt => opt.value === u)?.label
                                    return label || u
                                }).join(', ')
                            }
                        </p>
                    </div>

                    <div className="InfoCard2">
                        <div className="InfoCardHeader">
                            <FaClipboardList className="InfoIcon" />
                            <h4 className="InfoLabel">Tus respuestas</h4>
                        </div>
                        <div className="InfoTable">
                            {questions.map((q, index) => {
                                const answer = answers[q.id]
                                if (!answer) return null

                                const isEven = index % 2 === 0
                                const rowClass = isEven ? 'InfoRow even' : 'InfoRow odd'

                                let displayAnswer

                                if (Array.isArray(answer)) {
                                    displayAnswer = answer.map(val => {
                                        const label = q.options.find(opt => opt.value === val)?.label
                                        return label || val
                                    }).join(', ')
                                } else {
                                    displayAnswer =
                                        (q.options?.find(opt => opt.value === answer)?.label) ||
                                        (q.extraRadio?.value === answer ? q.extraRadio.label : answer)
                                }

                                return (
                                    <div key={q.id} className={rowClass}>
                                        <div className="InfoCell question"><strong>{q.question}</strong></div>
                                        <div className="InfoCell answer">{displayAnswer}</div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </div>

                <h4>Especificaciones Recomendadas</h4>
                <div className="SpecGrid">
                    <div className="SpecCard">
                        <FaMicrochip className="SpecIcon" />
                        <h5 className="SpecLabel">Procesador</h5>
                        <p className="SpecTitle">{result.processor}</p>
                    </div>
                    <div className="SpecCard">
                        <FaLaptop className="SpecIcon" />
                        <h5 className="SpecLabel">Gráficos</h5>
                        <p className="SpecTitle">{result.gpu}</p>
                    </div>
                    <div className="SpecCard">
                        <FaMemory className="SpecIcon" />
                        <h5 className="SpecLabel">RAM</h5>
                        <p className="SpecTitle">{result.ram}</p>
                    </div>
                    <div className="SpecCard">
                        <FaHdd className="SpecIcon" />
                        <h5 className="SpecLabel">Almacenamiento</h5>
                        <p className="SpecTitle">{result.storage}</p>
                    </div>
                </div>

                <h4>Especificaciones Extra</h4>
                <div className="SpecGrid">
                    <div className="SpecCard">
                        <FaRegHandPointer className="SpecIcon" />
                        <h5 className="SpecLabel">Pantalla táctil</h5>
                        <p className="SpecTitle">{result.touchscreen ? 'Sí' : 'No'}</p>
                    </div>
                    <div className="SpecCard">
                        <FaSuitcase className="SpecIcon" />
                        <h5 className="SpecLabel">Portabilidad</h5>
                        <p className="SpecTitle">{result.portability}</p>
                    </div>
                    <div className="SpecCard">
                        <FaWindows className="SpecIcon" />
                        <h5 className="SpecLabel">Sistema operativo</h5>
                        <p className="SpecTitle">{result.os}</p>
                    </div>
                    <div className="SpecCard">
                        <FaBatteryFull className="SpecIcon" />
                        <h5 className="SpecLabel">Batería</h5>
                        <p className="SpecTitle">{result.battery}</p>
                    </div>
                </div>


                {result.warnings.length > 0 && (
                    <>
                        <button onClick={() => setShowWarnings(!showWarnings)} className="ToggleSection" aria-expanded={showWarnings} aria-controls="warnings-panel">
                            {showWarnings ? '▲' : '▼'} Advertencias importantes
                        </button>
                        {showWarnings && (
                            <div id="warnings-panel" className="WarningGrid">
                                {result.warnings.map((warning, index) => (
                                    <div key={index} className="WarningCard">
                                        <FaExclamationTriangle className="WarningIcon" />
                                        <p className="WarningText">{warning}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {result.rationale.length > 0 && (
                    <>
                        <button onClick={() => setShowRationale(!showRationale)} className="ToggleSection" aria-expanded={showRationale} aria-controls="rationale-panel">
                            {showRationale ? '▲' : '▼'} Justificación técnica
                        </button>
                        {showRationale && (
                            <div id="rationale-panel" className="RationaleGrid">
                                {result.rationale.map((reason, index) => (
                                    <div key={index} className="RationaleCard">
                                        <FaCheckCircle className="RationaleIcon" />
                                        <p className="RationaleText">{reason}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}


                {(!result.laptopClass || result.laptopClass.length === 0) && result.approximateClass && result.approximateClass.length > 0 && (
                  <div className="FallbackOptions">
                    <div className="FallbackHeader">
                      <FaExclamationTriangle className="FallbackIcon" />
                      <h4>No encontramos matches exactos para tus necesidades</h4>
                    </div>

                    <div className="FallbackChoice">
                      <div className="FallbackCard">
                        <h5>Usá las specs como guía de compra</h5>
                        <p>Revisá las especificaciones recomendadas de arriba y usalas como referencia al buscar en tiendas.</p>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(`laptop ${result.processor} ${result.ram} RAM ${result.gpu} ${result.storage}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="FallbackButton"
                        >
                          Buscar en Google con estas specs
                        </a>
                      </div>

                      <div className="FallbackCard">
                        <h5>Ver equipos aproximados</h5>
                        <p>Estos modelos se acercan a lo que necesitás, aunque no cumplen todos los requisitos.</p>
                        <button onClick={() => setShowApproximate(!showApproximate)} className="FallbackButton FallbackButtonSecondary">
                          {showApproximate ? 'Ocultar modelos' : 'Ver modelos aproximados'}
                        </button>
                      </div>
                    </div>

                    {showApproximate && (
                      <div className="ApproximateSection">
                        <h5>Modelos aproximados (pueden no cumplir todos tus requisitos)</h5>
                        <div className="SuggestedModelsGrid">
                          {result.approximateClass.map((model, index) => (
                            <div key={model.id || index} className="LaptopCardWrapper Approximate">
                              <LaptopCard model={model} />
                              <span className="ApproximateBadge">Aproximado</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {(!result.laptopClass || result.laptopClass.length === 0) && (!result.approximateClass || result.approximateClass.length === 0) && (
                  <div className="NoResults">
                    <FaExclamationTriangle className="NoResultsIcon" />
                    <h4>Por el momento no se encuentra un equipo con las especificaciones recomendadas</h4>
                    <p>Usá las especificaciones de arriba como guía al buscar en tiendas.</p>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(`laptop ${result.processor} ${result.ram} RAM ${result.gpu} ${result.storage}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="NoResultsButton"
                    >
                      Buscar en Google con estas specs
                    </a>
                  </div>
                )}

                {result.laptopClass && Array.isArray(result.laptopClass) && (
                    <>
                        <h4>Modelos sugeridos (referencia):</h4>
                        <div className="SuggestedModelsGrid">
                            {result.laptopClass.map((model, index) => (
                                <LaptopCard key={model.id || index} model={model} />
                            ))}
                        </div>
                    </>
                )}

                <div className='reintentar'>
                    <p>¿Querés cambiar tus respuestas o probar otra combinación?</p>
                    <button onClick={handleReset} className='btn-grad'>Reiniciar cuestionario</button>
                </div>
            </div>
        )
    }


    return (
        <div className='Question'>
                <div className="QuizProgress">
                    <div className="QuizProgressBar" role="progressbar" aria-valuenow={step + 1} aria-valuemin={0} aria-valuemax={questions.length} aria-label={`Pregunta ${step + 1} de ${questions.length}`}>
                    <div className="QuizProgressFill" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
                </div>
                <span className="QuizProgressText">Pregunta {step + 1} de {questions.length}</span>
            </div>
            <h2>{current.question}</h2>
            {current.info && <p><em>{current.info}</em></p>}

            <div className='Question__grid'>
                {current.type === 'checkbox' && current.options.map(opt => (
                    <label className='Question__label' key={opt.value}>
                        <input
                            className='Question__input'
                            type="checkbox"
                            checked={Array.isArray(answers[current.id]) && answers[current.id]?.includes(opt.value)}
                            onChange={() => handleCheckboxChange(current.id, opt.value)}
                        />
                        {' '}<span>{opt.label}</span>
                    </label>
                ))}
                {current.type === 'checkbox' && current.extraRadio && (
                    <label className='Question__label'>
                        <input
                            type="radio"
                            name={`${current.id}-extra`}
                            checked={answers[current.id] === 'full_use'}
                            onChange={() =>
                                setAnswers(prev => ({
                                    ...prev,
                                    [current.id]: 'full_use'
                                }))
                            }
                        />
                        {' '}<span>{current.extraRadio.label}</span>
                    </label>
                )}



                {current.type === 'radio' && current.options.map(opt => (
                    <label key={opt.value} className='Question__label'>
                        <input
                            type="radio"
                            name={current.id}
                            checked={answers[current.id] === opt.value}
                            onChange={() => handleRadioChange(current.id, opt.value)}
                        />
                        {' '}<span>{opt.label}</span>
                    </label>
                ))}

            </div>

            <div className="QuizNav">
                {step > 0 && (
                    <button onClick={() => setStep(prev => prev - 1)} className="ButtonBack">
                        ← Atrás
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className="ButtonNext"
                    disabled={
                        (current.type === 'checkbox' && (!answers[current.id] || answers[current.id].length === 0)) ||
                        (current.type === 'radio' && !answers[current.id])
                    }
                >
                    {step < questions.length - 1 ? 'Siguiente' : 'Ver resultados'}
                </button>
            </div>
        </div>
    )
}

export default Recommendation
