import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.scss'

function App() {
  return (
    <main className="app-shell">
      <section className="hero">
        <div className="hero__visual" aria-hidden="true">
          <img src={heroImg} className="hero__base" width="170" height="179" alt="" />
          <img src={reactLogo} className="hero__react" alt="" />
          <img src={viteLogo} className="hero__vite" alt="" />
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">React + TypeScript + SCSS</p>
          <h1>3205-web</h1>
          <p className="hero__text">
            Frontend project scaffolded with Vite and ready for development.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
