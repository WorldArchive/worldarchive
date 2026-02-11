import Head from 'next/head'
import { useState } from 'react'
import Image from 'next/image'
import { getSpecimens } from '../../lib/notion'

export async function getStaticProps() {
  const specimens = await getSpecimens()
  return {
    props: { specimens },
    revalidate: 3600,
  }
}

export default function Archive({ specimens }) {
  const [selected, setSelected] = useState(null)

  // Si hay uno seleccionado, muestra la ficha detalle
  if (selected) {
    return <SpecimenDetail specimen={selected} onBack={() => setSelected(null)} />
  }

  // Si no, muestra la galería
  return (
    <>
      <Head>
        <title>DinoArchive | Mesozoic Collection</title>
      </Head>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e5a8e' }}>DINOARCHIVE</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Mesozoic Archive: Dinosaurs and reptiles from the age of reptiles (252-66 Ma)
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {specimens.map((specimen) => (
            <div 
              key={specimen.id}
              onClick={() => setSelected(specimen)}
              style={{ 
                background: 'white', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              <div style={{ 
                position: 'relative', 
                height: '200px', 
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {specimen.imageUrl ? (
                  <Image 
                    src={specimen.imageUrl} 
                    alt={specimen.name}
                    fill
                    style={{ objectFit: 'contain', padding: '1rem' }}
                    unoptimized={true}
                  />
                ) : (
                  <span style={{ color: '#999' }}>No Image</span>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{specimen.name}</h3>
                <span style={{ color: '#666', fontSize: '0.85rem' }}>
                  {specimen.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// Componente de detalle (todo en la misma página)
function SpecimenDetail({ specimen, onBack }) {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={onBack}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: '#1e5a8e', 
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '1rem'
        }}
      >
        ← Back to Gallery
      </button>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>{specimen.name}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Imagen grande */}
        <div style={{ background: '#f5f5f5', padding: '2rem', borderRadius: '8px' }}>
          {specimen.imageUrl && (
            <Image 
              src={specimen.imageUrl} 
              alt={specimen.name}
              width={500}
              height={400}
              style={{ objectFit: 'contain', width: '100%' }}
              unoptimized={true}
            />
          )}
        </div>

        {/* Datos básicos */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Scientific Data</h2>
          <div style={{ lineHeight: '2' }}>
            <p><strong>Primary Group:</strong> {specimen.primaryGroup}</p>
            <p><strong>Time:</strong> {specimen.time}</p>
            <p><strong>Diet:</strong> {specimen.diet}</p>
          </div>
          
          <p style={{ marginTop: '2rem', color: '#666' }}>
            Full description and detailed scientific data will be added here.
          </p>
        </div>
      </div>
    </div>
  )
}
