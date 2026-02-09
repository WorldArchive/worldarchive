import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { getSpecimens } from '../../lib/notion'

export default function MesozoicArchive({ specimens }) {
  return (
    <>
      <Head>
        <title>Mesozoic Archive | WorldArchive</title>
      </Head>

      <div className="header">
        <div className="container header-content">
          <img src="/logo.png" alt="DinoArchive" className="logo" />
          <h1 className="header-title">DINOARCHIVE</h1>
        </div>
      </div>

      <div className="container main-layout">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Infrastructure</h3>
            <Link href="/" className="sidebar-link">← Back to WorldArchive</Link>
            <a href="#" className="sidebar-link">About DinoArchive</a>
            <a href="#" className="sidebar-link">Record Acquisition Model</a>
          </div>
          
          <div className="sidebar-section">
            <h3 className="sidebar-title">Context Mesozoic</h3>
            <a href="#" className="sidebar-link">The Mesozoic World</a>
            <a href="#" className="sidebar-link">A Planet in Motion</a>
            <a href="#" className="sidebar-link">Seas That Came and Went</a>
          </div>
        </aside>

        <main className="content">
          <h2 className="page-title">Archive Mesozoic</h2>
          <p className="page-description">
            Dinosaurs and other Mesozoic reptiles, preserved as structured specimen records 
            from the age of reptiles (252-66 Ma).
          </p>

          <div className="filters">
            <button className="filter-btn">Name ↓</button>
            <button className="filter-btn">Primary Group</button>
            <button className="filter-btn">Time</button>
            <button className="filter-btn">Diet</button>
            <button className="filter-btn">Fossil Evidence</button>
            <button className="filter-btn">+ Filter</button>
          </div>

          <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>
            Specimen Records ({specimens.length})
          </h3>

          <div className="specimen-grid">
            {specimens.map((specimen) => (
              <Link 
                href={`/mesozoic/${specimen.id}`} 
                key={specimen.id}
                className="specimen-card"
              >
                <div className="specimen-image-container">
                  {specimen.coverImage ? (
                    <img 
                      src={specimen.coverImage} 
                      alt={specimen.name}
                      className="specimen-image"
                    />
                  ) : (
                    <div className="specimen-image-placeholder">
                      🦕
                    </div>
                  )}
                </div>
                <div className="specimen-info">
                  <span className="specimen-name">{specimen.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .specimen-image-container {
          width: 100%;
          height: 180px;
          background: #2d3748;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .specimen-image-placeholder {
          font-size: 4rem;
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const specimens = await getSpecimens()
  
  return {
    props: {
      specimens,
    },
    revalidate: 60,
  }
}
