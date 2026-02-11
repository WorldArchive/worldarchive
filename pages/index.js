import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>WorldArchive | Digital Natural History Museum</title>
        <meta name="description" content="Digital archive portal for natural history collections" />
      </Head>

      <div className="home-container">
        <header className="home-header">
          <h1 className="home-title">WORLDARCHIVE</h1>
          <p className="home-subtitle">Digital Natural History Collections</p>
        </header>

        <main className="archives-grid">
          <Link href="/dinoarchive/archive" className="archive-card">
            <div className="archive-icon">🦕</div>
            <h2>Mesozoic Archive</h2>
            <p>Dinosaurs and reptiles from the Age of Reptiles (252-66 Ma)</p>
            <span className="archive-link">Enter Archive →</span>
          </Link>

          <div className="archive-card coming-soon">
            <div className="archive-icon">🦣</div>
            <h2>Cenozoic Archive</h2>
            <p>Mammals and modern fauna (66 Ma - Present)</p>
            <span className="archive-link">Coming Soon</span>
          </div>

          <div className="archive-card coming-soon">
            <div className="archive-icon">🐚</div>
            <h2>Paleozoic Archive</h2>
            <p>Ancient life before dinosaurs (541-252 Ma)</p>
            <span className="archive-link">Coming Soon</span>
          </div>

          <div className="archive-card coming-soon">
            <div className="archive-icon">🌊</div>
            <h2>Deep Archive</h2>
            <p>Marine life through the ages</p>
            <span className="archive-link">Coming Soon</span>
          </div>
        </main>

        <footer className="home-footer">
          <p>© 2025 WorldArchive. Independent digital museum collections.</p>
        </footer>
      </div>

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .home-header {
          text-align: center;
          padding: 4rem 2rem 2rem;
        }

        .home-title {
          font-size: 4rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: #f8fafc;
          margin-bottom: 0.5rem;
        }

        .home-subtitle {
          color: #94a3b8;
          font-size: 1.25rem;
        }

        .archives-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .archive-card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .archive-card:hover:not(.coming-soon) {
          transform: translateY(-8px);
          border-color: #1e5a8e;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .archive-card.coming-soon {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .archive-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .archive-card h2 {
          color: #f8fafc;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .archive-card p {
          color: #94a3b8;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .archive-link {
          color: #1e5a8e;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .archive-card:hover:not(.coming-soon) .archive-link {
          color: #3b82f6;
        }

        .home-footer {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .home-title {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </>
  )
}
