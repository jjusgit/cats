export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Next.js Starter</p>
        <h1>기본 웹 프로젝트가 준비되었습니다.</h1>
        <p className="description">
          이 프로젝트는 App Router, TypeScript, ESLint를 포함한 최소 시작 구성을
          제공합니다.
        </p>

        <div className="actions">
          <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
            Next.js 문서 보기
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            React 문서 보기
          </a>
        </div>
      </section>
    </main>
  );
}
