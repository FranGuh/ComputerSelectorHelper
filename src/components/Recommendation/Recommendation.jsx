import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import questions from '../../constants/questions'
import convertToSpecs from '../../utils/convertToSpecs'
import { encodeAnswers, decodeAnswers, buildWhatsAppText } from '../../utils/shareUtils'
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
    FaClipboardList,
    FaShareAlt,
    FaCheck,
    FaInfoCircle
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

    const initialState = loadSavedState()
    const navigate = useNavigate()
    const [answers, setAnswers] = useState(initialState.answers)
    const [step, setStep] = useState(initialState.step)
    const [result, setResult] = useState(initialState.result)
    const [showWarnings, setShowWarnings] = useState(true)
    const [showRationale, setShowRationale] = useState(false)
    const [showApproximate, setShowApproximate] = useState(false)
    const [copied, setCopied] = useState(false)
    const [isSharedView, setIsSharedView] = useState(false)

    useEffect(() => {
        localStorage.setItem('csh_quiz_state', JSON.stringify({ answers, step, result }))
    }, [answers, step, result])

    // UX-05: scroll to top when result renders
    useEffect(() => {
        if (result) window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [result])

    // FEATURE: read shared plan from ?plan= URL param on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const plan = params.get('plan')
        if (plan) {
            const decoded = decodeAnswers(plan)
            if (decoded) {
                setAnswers(decoded)
                setResult(convertToSpecs(decoded))
                setIsSharedView(true)
            }
        }
    }, [])

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
        setIsSharedView(false)
        localStorage.removeItem('csh_quiz_state')
        // Clean URL params from shared links
        const url = new URL(window.location.href)
        url.searchParams.delete('plan')
        window.history.replaceState({}, '', url.toString())
    }

    // FEATURE: share handler — native share on mobile, clipboard fallback on desktop
    const handleShare = useCallback(() => {
        const shareUrl = `${window.location.origin}/quiz?plan=${encodeAnswers(answers)}`
        const shareText = result
            ? `Mi laptop recomendada: ${result.processor}, ${result.ram} RAM, ${result.gpu}.`
            : 'Mi recomendación personalizada de laptop.'
        if (navigator.share) {
            navigator.share({
                title: 'Mi recomendación — Computer Selector Helper',
                text: shareText,
                url: shareUrl
            }).catch(() => {})
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                setCopied(true)
                setTimeout(() => setCopied(false), 2500)
            }).catch(() => {
                prompt('Copiá este link para compartir tu recomendación:', shareUrl)
            })
        }
    }, [answers, result])

    const handleCompare = () => {
        if (!result || !result.laptopClass) return
        const ids = result.laptopClass.filter(m => !m.isGeneric).map(m => m.id).join(',')
        if (ids) {
            navigate(`/compare?models=${ids}`)
        }
    }

    if (result) {
        const shareUrl = `${window.location.origin}/quiz?plan=${encodeAnswers(answers)}`
        const waText = buildWhatsAppText(result, shareUrl)
        return (
            <div className="ResultContainer">
                <Helmet>
                    <title>Tu recomendación — Computer Selector Helper</title>
                    <meta name="description" content={`Tu recomendación: ${result.processor}, ${result.ram} RAM, ${result.gpu}. Modelos sugeridos incluidos.`} />
                    <meta property="og:title" content="Tu recomendación de laptop — Computer Selector Helper" />
                    <meta property="og:description" content={`Te recomendamos: ${result.processor}, ${result.ram} RAM, ${result.gpu}.`} />
                </Helmet>

                {/* FEATURE: banner shown when viewing a shared link */}
                {isSharedView && (
                    <div className="SharedViewBanner" role="note">
                        <FaInfoCircle className="SharedViewBannerIcon" aria-hidden="true" />
                        <span>
                            Estás viendo la recomendación de alguien más.
                            {' '}<button className="SharedViewBannerLink" onClick={handleReset}>Hacer mi propio quiz →</button>
                        </span>
                    </div>
                )}
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
                            {result.laptopClass.filter(m => !m.isGeneric).length > 0 && (
                                <button onClick={handleCompare} className="CompareModelsBtn--ingrid">
                                    <div className="CompareModelsBtn__icon">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                    </div>
                                    <span className="CompareModelsBtn__text">
                                        Comparar<br/>estos<br/>modelos
                                    </span>
                                </button>
                            )}
                        </div>
                    </>
                )}

                <div className="FinalActionsGrid">
                    <div className="ActionCard">
                        <h5>Compartir recomendación</h5>
                        <p>Guardá este link o envialo a alguien.</p>
                        <div className="ActionCard__buttons">
                            <button
                                id="share-results-btn"
                                onClick={handleShare}
                                className={`ActionBtn ShareBtn${copied ? ' copied' : ''}`}
                                aria-label="Compartir recomendación por link"
                            >
                                {copied
                                    ? <><FaCheck aria-hidden="true" /> Copiado</>
                                    : <><FaShareAlt aria-hidden="true" /> Copiar Link</>
                                }
                            </button>
                            <a
                                href={`https://wa.me/?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ActionBtn WhatsAppBtn"
                                aria-label="Compartir por WhatsApp"
                            >
                                📱 Enviar por WhatsApp
                            </a>
                        </div>
                    </div>
                    
                    <div className="ActionCard">
                        <h5>Volver a empezar</h5>
                        <p>Probá otra combinación de respuestas.</p>
                        <div className="ActionCard__buttons">
                            <button onClick={handleReset} className="ActionBtn RestartBtn">
                                Reiniciar cuestionario
                            </button>
                        </div>
                    </div>
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
