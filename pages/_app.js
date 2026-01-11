import "react-notion-x/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

export default function App({ Component, pageProps }) {
    return (
        <div className="main-layout">
            <Component {...pageProps} />
            <style jsx global>{`
        body {
          background-color: #f8f9fa; 
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .main-layout {
          min-height: 100vh;
        }
      `}</style>
        </div>
    );
}