import { getDatabase } from "../lib/notion";
import Link from "next/link";

export async function getStaticProps() {
    const posts = await getDatabase();
    return {
        props: { posts },
    };
}
export default function Home({ posts }) {
    return (
        <div className="container">
            <header className="header">
                <div className="logo">MyLog</div>
            </header>

            <div className="grid">
                {posts.map((post) => (
                    <Link href={`/post/${post.slug}`} key={post.id} className="card">
                        <div className="card-content">
                            <h3>{post.title}</h3>
                            <div className="card-footer">
                                <span>{post.date}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <style jsx>{`
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .header { display: flex; align-items: center; height: 4rem; margin-bottom: 2rem; }
        .logo { font-size: 1.5rem; font-weight: bold; color: #212529; }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .card {
          background: white;
          border-radius: 4px;
          box-shadow: 0 4px 16px 0 rgba(0,0,0,0.04);
          transition: transform 0.25s ease-in, box-shadow 0.25s ease-in;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }
        
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 20px 0 rgba(0,0,0,0.08);
        }
        
        .card-content { padding: 1rem; flex-grow: 1; }
        .card-content h3 { font-size: 1rem; margin: 0 0 0.5rem; color: #212529; }
        
        .card-footer {
          padding: 0.625rem 1rem;
          border-top: 1px solid #f1f3f5;
          font-size: 0.75rem;
          color: #868e96;
        }
      `}</style>
        </div>
    );
}