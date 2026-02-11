import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getDinosaurs } from '../../lib/opensea'

export async function getStaticProps() {
  try {
    const specimens = await getDinosaurs()
    
    return {
      props: { specimens },
      revalidate: 3600, // Revalidar cada 1 hora
    }
  } catch (error) {
    console.error('Error:', error.message)
    return {
      props: { specimens: [] },
      revalidate: 60,
    }
  }
}

export default function Archive({ specimens }) {
  if (specimens.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Cargando archivo...</h1>
        <p>No se encontraron dinosaurios o hay un error de conexión.</p>
      </div>
    )
  }

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
        <p style={{ color: '#999', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {specimens.length} specimens catalogued
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {specimens.map((specimen) => (
            <Link 
              key={specimen.id} 
              href={`/dinoarchive/${specimen.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ 
                background: 'white', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}>
                <div style={{ 
                  position: 'relative', 
                  height: '250px', 
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
                      sizes="250px"
                      style={{ objectFit: 'cover' }}
                      unoptimized={true}
                    />
                  ) : (
                    <span style={{ color: '#999' }}>No Image</span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
                    {specimen.name}
                  </h3>
                  <span style={{ color: '#666', fontSize: '0.85rem' }}>
                    {specimen.scientificData.time || 'Unknown era'}
                  </span>
                  {specimen.scientificData.diet && (
                    <span style={{ 
                      display: 'block', 
                      color: '#999', 
                      fontSize: '0.8rem',
                      marginTop: '0.25rem'
                    }}>
                      {specimen.scientificData.diet}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
