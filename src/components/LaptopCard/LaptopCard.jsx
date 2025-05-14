// components/LaptopCard.jsx

import React from 'react'
import './LaptopCard.css' // Si querés darle estilos personalizados

function LaptopCard({ model }) {
  if (!model) return null

  return (
    <div className="LaptopCard">
      <h3>🎯 Te sugerimos esta laptop:</h3>
      <img src={model.image} alt={model.name} style={{ width: '250px' }} />
      <h4>{model.name}</h4>
      <p><strong>Uso recomendado:</strong> {model.use}</p>
      <p><strong>Especificaciones:</strong> {model.specs}</p>
      <p><strong>Precio aproximado:</strong> {model.price}</p>
      <a href={model.link} target="_blank" rel="noopener noreferrer">
        <button>Ver en tienda</button>
      </a>
    </div>
  )
}

export default LaptopCard
