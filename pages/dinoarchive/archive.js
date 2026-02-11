import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getSpecimens } from '../../lib/notion'

export async function getStaticProps() {
  try {
    const specimens = await getSpecimens()
    
    return {
      props: { specimens },
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Error in getStaticProps (archive):', error.message)
    
    // Devolver array vacío para no romper el build
    return {
      props: { 
        specimens: [],
        error: error.message 
      },
      revalidate: 60, // Reintentar más pronto si hay error
    }
  }
}

export default function Archive({ specimens, error }) {
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        <h1>Error loading archive</h1>
        <p>{error}</p>
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
        
        {specimens.length === 0 ? (
          <p>No specimens found.</p>
        ) : (
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
                  cursor: 'pointer'
                }}>
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
                        sizes="250px"
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
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
