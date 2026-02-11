import Image from 'next/image'
import Link from 'next/link'
import { getSpecimens, getSpecimenById } from '../../lib/notion'

export async function getStaticPaths() {
  try {
    const specimens = await getSpecimens()
    
    return {
      paths: specimens.map(s => ({ params: { id: s.id } })),
      fallback: 'blocking',
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error.message)
    
    // Devolver paths vacío para no romper el build
    return {
      paths: [],
      fallback: 'blocking',
    }
  }
}

export async function getStaticProps({ params }) {
  try {
    const specimen = await getSpecimenById(params.id)
    
    return {
      props: { specimen },
      revalidate: 3600,
    }
  } catch (error) {
    console.error('Error in getStaticProps ([id]):', error.message)
    
    return {
      notFound: true, // Mostrar página 404 si no se encuentra
    }
  }
}

export default function SpecimenPage({ specimen }) {
  const d = specimen.scientificData
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui' }}>
      <Link href="/dinoarchive/archive" style={{ color: '#1e5a8e' }}>
        ← Back to Archive
      </Link>
      
      <h1 style={{ fontSize: '2.5rem', margin: '1rem 0', fontWeight: 'bold' }}>
        {specimen.name}
      </h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '3rem' }}>
        <aside style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
            Scientific Data Sheet
          </h2>
          
          {[
            ['Primary Group', d.primaryGroup],
            ['Clade', d.clade],
            ['Sub-clade', d.subClade],
            ['Family', d.family],
            ['Time', d.time],
            ['Ecological Role', d.ecologicalRole],
            ['Diet', d.diet],
            ['Locomotion', d.locomotion],
            ['Primary Country', d.country],
            ['Length', d.length],
            ['Mass', d.mass],
            ['Fossil Evidence', d.fossilEvidence],
            ['Fossil Context', d.fossilContext],
          ].map(([label, val]) => (
            <div key={label} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              padding: '0.4rem 0',
              borderBottom: '1px solid #e0e0e0',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: '#666' }}>{label}</span>
              <span style={{ fontWeight: 500 }}>{val || '—'}</span>
            </div>
          ))}
        </aside>

        <main>
          {specimen.imageUrl && (
            <div style={{ 
              background: '#f5f5f5', 
              padding: '2rem', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <Image 
                src={specimen.imageUrl} 
                alt={specimen.name}
                width={600}
                height={400}
                style={{ objectFit: 'contain', maxHeight: '400px' }}
                unoptimized={true}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
