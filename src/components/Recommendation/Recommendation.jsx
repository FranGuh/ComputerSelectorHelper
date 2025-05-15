import React, { useState } from 'react'
import questions from '../../constants/questions'
import convertToSpecs from '../../utils/convertToSpecs'
import './Recommendation.css'
import LaptopCard from '../LaptopCard/LaptopCard'

import {
    FaMicrochip,       // Procesador
    FaMemory,          // RAM
    FaHdd,             // Almacenamiento
    FaLaptop,          // GPU
    FaRegHandPointer,  // Pantalla táctil
    FaSuitcase,        // Portabilidad
    FaBatteryFull,     // Batería
    FaWindows          // Sistema operativo (Windows genérico),
    , FaExclamationTriangle,
    FaCheckCircle, FaClipboardList
} from 'react-icons/fa'




function Recommendation() {
    const [answers, setAnswers] = useState({})
    const [step, setStep] = useState(0)
    const [result, setResult] = useState(null)

    const current = questions[step]

    const handleCheckboxChange = (questionId, value) => {
        // Si estaba seleccionada la opción "full_use", la eliminamos
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
    }

    if (result) {
        return (
            <div className="ResultContainer">
                <h2>Tu recomendación técnica:</h2>
                <div className="ResultIntroCards">
                    <div className="InfoCard">
                        <FaCheckCircle className="InfoIcon" />
                        <h4 className="InfoLabel">Usos seleccionados</h4>
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
                        <FaClipboardList className="InfoIcon" />
                        <h4 className="InfoLabel">Tus respuestas</h4>
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

                <h4> 💻 Especificaciones Recomendadas </h4>
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

                <h4> 💻🎯 Especificaciones Extra </h4>
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
                        <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>
                            ⚠️ Advertencias importantes:
                        </h4>
                        <div className="WarningGrid">
                            {result.warnings.map((warning, index) => (
                                <div key={index} className="WarningCard">
                                    <FaExclamationTriangle className="WarningIcon" />
                                    <p className="WarningText">{warning}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {result.rationale.length > 0 && (
                <>
                    <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>
                    🧠 Justificación técnica:
                    </h4>
                    <div className="RationaleGrid">
                    {result.rationale.map((reason, index) => (
                        <div key={index} className="RationaleCard">
                        <FaCheckCircle className="RationaleIcon" />
                        <p className="RationaleText">{reason}</p>
                        </div>
                    ))}
                    </div>
                </>
                )}


                {result.laptopClass && Array.isArray(result.laptopClass) && (
                <>
                    <h4>🎯 Modelos sugeridos (Puede haber alguno o no es solo referencia):</h4>
                    <div className="SuggestedModelsGrid">
                    {result.laptopClass.map((model, index) => (
                        <LaptopCard key={model.id || index} model={model} />
                    ))}
                    </div>
                </>
                )}

                <div className='reintentar'>
                    <p>¿Querés cambiar tus respuestas o probar otra combinación?</p>
                    <button button onClick={handleReset} className='btn-grad'>Reiniciar cuestionario</button>
                </div>
            </div>
        )
    }


    return (
        <div className='Question'>
            <h2>{current.question}</h2>
            {current.info && <p><em>{current.info}</em></p>}

            <div className='Question__grid'>
                {current.type === 'checkbox' && current.options.map(opt => (
                    <label className='Question__label' key={opt.value}>
                        <input
                            className='Question__input'
                            type="checkbox"
                            checked={answers[current.id]?.includes(opt.value) || false}
                            onChange={() => handleCheckboxChange(current.id, opt.value)}
                        />
                        {' '}{opt.label}
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
                        {' '}{current.extraRadio.label}
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
                        {' '}{opt.label}
                    </label>
                ))}

            </div>

            <button
                onClick={handleNext}
                style={{ marginTop: '20px' }}
                disabled={
                    (current.type === 'checkbox' && (!answers[current.id] || answers[current.id].length === 0)) ||
                    (current.type === 'radio' && !answers[current.id])
                }
            >
                Siguiente
            </button>
        </div>
    )
}

export default Recommendation
