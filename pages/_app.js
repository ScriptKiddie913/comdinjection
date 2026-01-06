import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>SCP Entity Tracking Portal</title>
        <meta
          name="description"
          content="SCP Foundation experimental entity tracking interface (CTF)."
        />
      </Head>
      <div className="app-root">
        <header className="app-header">
          <div className="logo-block">
            <div className="logo-circle" />
            <div className="logo-text">
              <span className="logo-title">SCP FOUNDATION</span>
              <span className="logo-subtitle">SECURE · CONTAIN · PROTECT</span>
            </div>
          </div>
          <div className="header-status">
            <span className="status-label">SYSTEM:</span>
            <span className="status-value">ENTITY TRACKING PORTAL v0.9-BETA</span>
          </div>
        </header>
        <main className="app-main">
          <Component {...pageProps} />
        </main>
        <footer className="app-footer">
          <span>CLASSIFIED // LEVEL-3 ACCESS REQUIRED</span>
        </footer>
      </div>
    </>
  );
}

export default MyApp;
