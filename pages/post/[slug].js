import { NotionRenderer } from "react-notion-x";
import { NotionAPI } from "notion-client";
import { getDatabase } from "../../lib/notion";
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const notion = new NotionAPI();

export async function getStaticPaths() {
    const posts = await getDatabase();
    const paths = posts.map((post) => ({
        params: { slug: String(post.slug) },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const posts = await getDatabase();
    const post = posts.find((p) => p.slug === params.slug);

    if (!post) return { notFound: true };

    try {
        const recordMap = await notion.getPage(post.id);

        return {
            props: { recordMap },
        };
    } catch (error) {
        return { notFound: true };
    }
}

const Code = dynamic(() =>
    import("react-notion-x/build/third-party/code").then((m) => m.Code),
    { ssr: false }
);
const Collection = dynamic(() =>
    import("react-notion-x/build/third-party/collection").then((m) => m.Collection),
    { ssr: false }
);

export default function Post({ recordMap }) {
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="loading-placeholder" />;
    if (!recordMap) return null;

    return (
        <div className="post-page">
            <nav className="fixed-nav">
                <button onClick={() => router.back()} className="back-btn">
                    <span className="arrow">←</span>
                    <span className="text">뒤로가기</span>
                </button>
            </nav>

            <NotionRenderer
                recordMap={recordMap}
                fullPage={true}
                darkMode={false}
                disableHeader={true}
                components={{
                    nextImage: Image,
                    nextLink: Link,
                    Code,
                    Collection
                }}
            />
            <style jsx global>{`
        .fixed-nav {
          position: fixed;
          top: 30px;
          left: calc(50% - 480px); 
          z-index: 9999; 
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #e9ecef;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
          color: #495057;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: #f8f9fa;
          transform: translateX(-5px);
          color: #868e96;
        }

        @media (max-width: 1000px) {
          .fixed-nav {
            position: absolute;
            top: 15px;
            left: 15px;
          }
          .back-btn .text { display: none; } 
        }

        .notion-page {
          padding-top: 50px !important;
        }

`}</style>
        </div>
    );
}