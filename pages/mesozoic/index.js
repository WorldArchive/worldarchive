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
        .header {
          background: #1a202c;
          padding: 2rem 0;
          border-bottom: 1px solid #2d3748;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .header-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .logo {
          width: 100px;
          height: auto;
          margin-bottom: 0.5rem;
        }
        
        .header-title {
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #f7fafc;
          margin: 0;
        }
        
        .main-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 3rem;
          padding: 2rem;
        }
        
        .sidebar {
          background: #2d3748;
          padding: 1.5rem;
          border-radius: 8px;
          height: fit-content;
        }
        
        .sidebar-section {
          margin-bottom: 2rem;
        }
        
        .sidebar-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #a0aec0;
          margin-bottom: 1rem;
        }
        
        .sidebar-link {
          display: block;
          color: #e2e8f0;
          text-decoration: none;
          padding: 0.5rem 0;
          font-size: 0.9rem;
        }
        
        .sidebar-link:hover {
          color: #63b3ed;
        }
        
        .content {
          padding: 1rem 0;
        }
        
        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #f7fafc;
        }
        
        .page-description {
          color: #a0aec0;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        
        .filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          background: #2d3748;
          border: 1px solid #4a5568;
          color: #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
        }
        
        .filter-btn:hover {
          background: #4a5568;
        }
        
        .specimen-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .specimen-card {
          background: #2d3748;
          border-radius: 8px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.2s;
        }
        
        .specimen-card:hover {
          transform: translateY(-4px);
        }
        
        .specimen-image-container {
          width: 100%;
          height: 180px;
          background: #1a202c;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .specimen-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .specimen-image-placeholder {
          font-size: 3rem;
        }
        
        .specimen-info {
          padding: 1rem;
        }
        
        .specimen-name {
          color: #f7fafc;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .main-layout {
            grid-template-columns: 1fr;
          }
          
          .sidebar {
            order: 2;
          }
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
