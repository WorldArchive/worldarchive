import Head from 'next/head'
import Link from 'next/link'
import { getSpecimens } from '../../lib/notion'

export default function MesozoicArchive({ specimens }) {
  return (
    <>
      <Head>
        <title>DinoArchive | Digital Mesozoic Museum</title>
        <meta name="description" content="Curated digital archive of dinosaurs and Mesozoic reptiles" />
      </Head>

      <div className="header">
        <div className="container header-content">
          <img src="/DinoArchive.png" alt="DinoArchive" className="header-logo" />
        </div>
      </div>

      <div className="container main-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <img src="/logo.png" alt="DinoArchive Seal" className="seal-logo" />
            <span className="brand-text">DINOARCHIVE</span>
          </div>
          
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

          <h3 className="records-count">
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
                  <span className="specimen-name">{specimen.name || 'Unnamed'}</span>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .header {
          background: #ffffff;
          padding: 2rem 0;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        
        .header-content {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .header-logo {
          height: 80px;
          width: auto;
          max-width: 400px;
          object-fit: contain;
        }
        
        .main-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: 2rem;
          padding: 2rem;
          background: #f8fafc;
          min-height: calc(100vh - 130px);
        }
        
        .sidebar {
          background: #ffffff;
          padding: 1.5rem;
          border-radius: 12px;
          height: fit-content;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
        }
        
        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .seal-logo {
          width: 40px;
          height: 40px;
          object-fit: contain;
          opacity: 0.9;
        }
        
        .brand-text {
          font-size: 0.85rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1e293b;
        }
        
        .sidebar-section {
          margin-bottom: 1.5rem;
        }
        
        .sidebar-section:last-child {
          margin-bottom: 0;
        }
        
        .sidebar-title {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #64748b;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        
        .sidebar-link {
          display: block;
          color: #475569;
          text-decoration: none;
          padding: 0.4rem 0;
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        
        .sidebar-link:hover {
          color: #1e5a8e;
        }
        
        .content {
          padding: 0;
        }
        
        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        
        .page-description {
          color: #64748b;
          margin-bottom: 1.5rem;
          line-height: 1.6;
          font-size: 0.9rem;
        }
        
        .filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }
        
        .filter-btn {
          background: #ffffff;
          border: 1px solid #d1d5db;
          color: #374151;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }
        
        .records-count {
          margin-bottom: 1rem;
          color: #64748b;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .specimen-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.25rem;
        }
        
        .specimen-card {
          background: #ffffff;
          border-radius: 10px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid #e2e8f0;
        }
        
        .specimen-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .specimen-image-container {
          width: 100%;
          height: 160px;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .specimen-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .specimen-image-placeholder {
          font-size: 2.5rem;
          opacity: 0.4;
        }
        
        .specimen-info {
          padding: 0.875rem;
          border-top: 1px solid #e2e8f0;
        }
        
        .specimen-name {
          color: #0f172a;
          font-weight: 600;
          font-size: 0.85rem;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        @media (max-width: 768px) {
          .main-layout {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 1rem;
          }
          
          .sidebar {
            order: 2;
          }
          
          .header-logo {
            height: 60px;
            max-width: 300px;
          }
          
          .specimen-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1rem;
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
