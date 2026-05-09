import React from 'react'
import { Helmet } from 'react-helmet-async'
import Recommendation from '../../components/Recommendation/Recommendation'
import './Quiz.css'

const Quiz = () => {
  return (
    <>
      <Helmet>
        <title>Cuestionario — Computer Selector Helper</title>
        <meta name="description" content="Respondé nuestro cuestionario para recibir una recomendación de laptop personalizada." />
        <meta property="og:title" content="Cuestionario — Computer Selector Helper" />
        <meta property="og:description" content="Respondé nuestro cuestionario para recibir una recomendación de laptop personalizada." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://computerselectorhelper.vercel.app/quiz" />
      </Helmet>
      <div className="Quiz">
          <Recommendation />
      </div>
    </>
  )
}

export default Quiz
