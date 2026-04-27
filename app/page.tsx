"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type MenuKey =
  | "dashboard"
  | "data-center"
  | "media-center"
  | "social-media"
  | "requests"
  | "admin";

type Member = {
  id: number;
  name: string;
  phone: string;
  organization: string;
  password: string;
  isAdmin?: boolean;
};

type Post = {
  id: number;
  category: "데이터센터" | "미디어센터";
  title: string;
  summary: string;
  date: string;
  author: string;
  content: string[];
  isNotice?: boolean;
  mediaType?: "youtube" | "file";
  attachmentLabel?: string;
  sourceUrl?: string;
};

type RequestItem = {
  id: number;
  title: string;
  description: string;
  requester: string;
  createdAt: string;
  status: "접수" | "검토중" | "준비중";
};

type Bookmark = {
  id: number;
  name: string;
  href: string;
};

type SocialFeed = {
  id: number;
  pageName: string;
  url: string;
  latestPost: string;
  publishedAt: string;
};

const SESSION_TIMEOUT_MS = 5 * 60 * 1000;

const members: Member[] = [
  {
    id: 1,
    name: "김민수",
    phone: "01012345678",
    organization: "정책기획팀",
    password: "CATS2026",
    isAdmin: true,
  },
  {
    id: 2,
    name: "박서연",
    phone: "01098765432",
    organization: "대외협력실",
    password: "MEDIA2026",
  },
  {
    id: 3,
    name: "이도현",
    phone: "01055556666",
    organization: "디지털분석센터",
    password: "DATA2026",
  },
];

const posts: Post[] = [
  {
    id: 1,
    category: "데이터센터",
    title: "주간 정책 모니터링 리포트",
    summary: "분과별 핵심 이슈와 대응 포인트를 정리한 이번 주 브리핑입니다.",
    date: "2026.04.26",
    author: "관리자",
    content: [
      "이번 주 정책 동향 중 분과 대응이 필요한 안건을 우선순위 기준으로 정리했습니다.",
      "지역별 반응과 미디어 확산 흐름을 함께 확인할 수 있도록 핵심 수치와 해석을 포함했습니다.",
      "추가 자료가 필요한 경우 자료요청 메뉴를 통해 상세 데이터셋을 요청할 수 있습니다.",
    ],
    isNotice: true,
    attachmentLabel: "주간정책모니터링.pdf",
  },
  {
    id: 2,
    category: "데이터센터",
    title: "지역 현안 분석 자료집",
    summary: "지방 조직 활동과 연결되는 지역별 데이터 요약본입니다.",
    date: "2026.04.24",
    author: "데이터센터",
    content: [
      "주요 지역 현안을 주제별로 분류하고, 관련 발언량과 이슈 반응을 비교했습니다.",
      "현장 대응 문안 작성에 활용할 수 있도록 권역별 포인트를 별도 정리했습니다.",
    ],
    attachmentLabel: "지역현안분석자료집.xlsx",
  },
  {
    id: 3,
    category: "미디어센터",
    title: "유튜브 인터뷰 클립 모음",
    summary: "최근 인터뷰 영상 중 활용도 높은 장면을 선별했습니다.",
    date: "2026.04.25",
    author: "미디어센터",
    content: [
      "주요 인터뷰 영상에서 재가공 가능한 핵심 발언 구간을 시간대별로 정리했습니다.",
      "쇼츠, 카드뉴스, 페이스북 업로드용으로 각각 활용 가능한 방향을 함께 적어두었습니다.",
    ],
    mediaType: "youtube",
    sourceUrl: "https://youtube.com/watch?v=cats-media-demo",
  },
  {
    id: 4,
    category: "미디어센터",
    title: "현장 사진 및 보도자료 패키지",
    summary: "SNS와 언론 대응에 바로 사용할 수 있는 압축 자료입니다.",
    date: "2026.04.23",
    author: "관리자",
    content: [
      "행사 현장 사진 원본과 보도자료 초안, 배포용 요약문이 함께 포함된 패키지입니다.",
      "언론 전달 전 최종 검토가 필요하므로 배포 문구는 상황에 맞게 조정해 사용하면 됩니다.",
    ],
    mediaType: "file",
    attachmentLabel: "현장사진_보도자료.zip",
  },
];

const requestItems: RequestItem[] = [
  {
    id: 1,
    title: "지역별 참여자 추이 데이터 요청",
    description: "최근 6개월 기준 시군구 단위 추이를 표와 그래프로 요청합니다.",
    requester: "박서연",
    createdAt: "2026.04.27 09:10",
    status: "접수",
  },
  {
    id: 2,
    title: "영상 자막본 전달 요청",
    description: "4월 25일 업로드 영상의 자막 스크립트 공유 부탁드립니다.",
    requester: "이도현",
    createdAt: "2026.04.26 16:20",
    status: "검토중",
  },
];

const bookmarks: Bookmark[] = [
  { id: 1, name: "주간 브리핑", href: "#" },
  { id: 2, name: "콘텐츠 제작가이드", href: "#" },
  { id: 3, name: "긴급 요청 폼", href: "#" },
];

const socialFeeds: SocialFeed[] = [
  {
    id: 1,
    pageName: "CATS 정책브리핑",
    url: "https://facebook.com/cats-policy",
    latestPost: "현장 메시지 요약 카드뉴스가 방금 업데이트되었습니다.",
    publishedAt: "2026.04.27 08:45",
  },
  {
    id: 2,
    pageName: "CATS 미디어룸",
    url: "https://facebook.com/cats-media",
    latestPost: "금일 인터뷰 영상 티저가 게시되었습니다.",
    publishedAt: "2026.04.26 19:30",
  },
];

const gnbItems: { key: MenuKey; label: string }[] = [
  { key: "dashboard", label: "대시보드" },
  { key: "data-center", label: "데이터센터" },
  { key: "media-center", label: "미디어센터" },
  { key: "social-media", label: "실시간소셜미디어" },
  { key: "requests", label: "자료요청" },
];

function formatPhoneInput(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}

export default function Home() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [loginTime, setLoginTime] = useState<string>("-");
  const [error, setError] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const dataPosts = useMemo(
    () => posts.filter((post) => post.category === "데이터센터"),
    [],
  );
  const mediaPosts = useMemo(
    () => posts.filter((post) => post.category === "미디어센터"),
    [],
  );

  useEffect(() => {
    if (!currentMember) return;

    const onActivity = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", onActivity);
    window.addEventListener("keydown", onActivity);
    window.addEventListener("click", onActivity);
    window.addEventListener("scroll", onActivity);

    return () => {
      window.removeEventListener("mousemove", onActivity);
      window.removeEventListener("keydown", onActivity);
      window.removeEventListener("click", onActivity);
      window.removeEventListener("scroll", onActivity);
    };
  }, [currentMember]);

  useEffect(() => {
    if (!currentMember) return;

    const interval = window.setInterval(() => {
      if (Date.now() - lastActivity >= SESSION_TIMEOUT_MS) {
        window.alert("5분간 활동이 없어 자동 로그아웃되었습니다.");
        handleLogout();
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentMember, lastActivity]);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const foundMember = members.find(
      (member) => member.phone === phone && member.password === password,
    );

    if (!foundMember) {
      setError("등록된 휴대전화 또는 패스워드가 일치하지 않습니다.");
      return;
    }

    const now = new Date().toLocaleString("ko-KR", {
      dateStyle: "short",
      timeStyle: "medium",
    });

    setCurrentMember(foundMember);
    setActiveMenu("dashboard");
    setLoginTime(now);
    setLastActivity(Date.now());
    setError("");
    window.alert(`${foundMember.name}님, 환영합니다.`);
  }

  function handleLogout() {
    setCurrentMember(null);
    setPhone("");
    setPassword("");
    setLoginTime("-");
    setActiveMenu("dashboard");
    setSelectedPost(null);
    setRequestTitle("");
    setRequestDescription("");
    setError("");
  }

  function handleMenuChange(menu: MenuKey) {
    setActiveMenu(menu);
    setSelectedPost(null);
  }

  function handlePostOpen(post: Post) {
    setSelectedPost(post);
    setActiveMenu(post.category === "데이터센터" ? "data-center" : "media-center");
  }

  function handleRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.alert("등록시 요청에 따른 자료 등록은 지연될수있습니다.");
    setRequestTitle("");
    setRequestDescription("");
  }

  function renderPostList(items: Post[], showMediaType = false) {
    return (
      <div className="board-list">
        <div className="board-header">
          <span className="board-col-title">제목</span>
          {showMediaType ? <span className="board-col-type">유형</span> : null}
          <span className="board-col-date">등록일</span>
        </div>
        {items.map((item) => (
          <button
            type="button"
            className="board-row"
            key={item.id}
            onClick={() => handlePostOpen(item)}
          >
            <div className="board-title-block">
              <div className="board-title-line">
                {item.isNotice ? <em>공지</em> : null}
                <strong>{item.title}</strong>
              </div>
              <p>{item.summary}</p>
            </div>
            {showMediaType ? (
              <span className="board-type">
                {item.mediaType === "youtube" ? "YouTube" : "첨부파일"}
              </span>
            ) : null}
            <span className="board-date">{item.date}</span>
          </button>
        ))}
      </div>
    );
  }

  function renderPostDetail(post: Post) {
    return (
      <section className="detail-panel">
        <div className="detail-topbar">
          <div>
            <p>{post.category}</p>
            <h2>{post.title}</h2>
          </div>
          <button type="button" onClick={() => setSelectedPost(null)}>
            목록으로
          </button>
        </div>

        <div className="detail-meta">
          <span>등록일 {post.date}</span>
          <span>작성자 {post.author}</span>
          {post.mediaType ? (
            <span>유형 {post.mediaType === "youtube" ? "YouTube" : "첨부파일"}</span>
          ) : null}
        </div>

        <div className="detail-body">
          <p className="detail-summary">{post.summary}</p>
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="detail-links">
          {post.attachmentLabel ? <span>첨부파일 {post.attachmentLabel}</span> : null}
          {post.sourceUrl ? (
            <a href={post.sourceUrl} target="_blank" rel="noreferrer">
              원본 링크 열기
            </a>
          ) : null}
        </div>
      </section>
    );
  }

  function renderMainContent() {
    switch (activeMenu) {
      case "data-center":
        return (
          <section className="panel-stack">
            <div className="section-heading">
              <div>
                <p>데이터센터</p>
                <h2>{selectedPost ? "상세보기" : "게시판 목록, 상세보기, 검색 구조"}</h2>
              </div>
              <div className="search-shell">
                <input placeholder="제목, 내용, 첨부파일 검색" />
                <button type="button">검색</button>
              </div>
            </div>
            {selectedPost ? renderPostDetail(selectedPost) : renderPostList(dataPosts)}
          </section>
        );
      case "media-center":
        return (
          <section className="panel-stack">
            <div className="section-heading">
              <div>
                <p>미디어센터</p>
                <h2>{selectedPost ? "상세보기" : "단순 목록형 미디어 게시판"}</h2>
              </div>
              <div className="search-shell">
                <input placeholder="영상, 첨부자료, 키워드 검색" />
                <button type="button">검색</button>
              </div>
            </div>
            {selectedPost ? renderPostDetail(selectedPost) : renderPostList(mediaPosts, true)}
          </section>
        );
      case "social-media":
        return (
          <section className="panel-stack">
            <div className="section-heading">
              <div>
                <p>실시간소셜미디어</p>
                <h2>관리자가 등록한 Facebook 페이지 연동 영역</h2>
              </div>
            </div>
            <div className="social-grid">
              {socialFeeds.map((feed) => (
                <article className="social-card" key={feed.id}>
                  <div className="social-header">
                    <strong>{feed.pageName}</strong>
                    <span>{feed.publishedAt}</span>
                  </div>
                  <p>{feed.latestPost}</p>
                  <a href={feed.url} target="_blank" rel="noreferrer">
                    페이지 바로가기
                  </a>
                </article>
              ))}
            </div>
            <p className="integration-note">
              실제 운영 시에는 Facebook Graph API 또는 외부 피드 수집 서버 연동이
              필요합니다.
            </p>
          </section>
        );
      case "requests":
        return (
          <section className="panel-stack">
            <div className="section-heading">
              <div>
                <p>자료요청</p>
                <h2>제목 및 설명 입력 폼</h2>
              </div>
            </div>
            <form className="request-form" onSubmit={handleRequestSubmit}>
              <label>
                제목
                <input
                  value={requestTitle}
                  onChange={(event) => setRequestTitle(event.target.value)}
                  placeholder="요청 제목을 입력하세요"
                  required
                />
              </label>
              <label>
                설명
                <textarea
                  value={requestDescription}
                  onChange={(event) => setRequestDescription(event.target.value)}
                  placeholder="필요한 자료와 사용 목적을 입력하세요"
                  rows={6}
                  required
                />
              </label>
              <button type="submit">자료 요청 등록</button>
            </form>
          </section>
        );
      case "admin":
        return (
          <section className="panel-stack">
            <div className="section-heading">
              <div>
                <p>관리자</p>
                <h2>운영 메뉴 구조 미리보기</h2>
              </div>
            </div>
            <div className="admin-grid">
              <section className="admin-card">
                <h3>회원관리</h3>
                <p>목록, 상세보기, 수정/입력</p>
                <ul>
                  {members.map((member) => (
                    <li key={member.id}>
                      <strong>{member.name}</strong>
                      <span>{member.organization}</span>
                      <span>{member.phone}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="admin-card">
                <h3>데이터센터 / 미디어센터</h3>
                <p>제목, 내용, 첨부파일, URL, 공지여부 입력</p>
                <div className="field-chip-row">
                  <span>제목</span>
                  <span>내용</span>
                  <span>첨부파일</span>
                  <span>URL</span>
                  <span>공지여부</span>
                </div>
              </section>
              <section className="admin-card">
                <h3>실시간소셜미디어</h3>
                <p>Facebook URL 입력 시 프론트에 최근 게시물 노출</p>
                <ul>
                  {socialFeeds.map((feed) => (
                    <li key={feed.id}>
                      <strong>{feed.pageName}</strong>
                      <span>{feed.url}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section className="admin-card">
                <h3>북마크 / 자료요청목록</h3>
                <p>우측 바로가기와 요청 내역 관리</p>
                <ul>
                  {requestItems.map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}</strong>
                      <span>{item.requester}</span>
                      <span>{item.status}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </section>
        );
      case "dashboard":
      default:
        return (
          <section className="dashboard-grid">
            <div className="panel-stack">
              <section className="content-panel">
                <div className="section-heading">
                  <div>
                    <p>데이터센터</p>
                    <h2>최근 게시물</h2>
                  </div>
                  <button type="button" onClick={() => handleMenuChange("data-center")}>
                    전체보기
                  </button>
                </div>
                {renderPostList(dataPosts.slice(0, 2))}
              </section>
              <section className="content-panel">
                <div className="section-heading">
                  <div>
                    <p>미디어센터</p>
                    <h2>최근 게시물</h2>
                  </div>
                  <button type="button" onClick={() => handleMenuChange("media-center")}>
                    전체보기
                  </button>
                </div>
                {renderPostList(mediaPosts.slice(0, 2), true)}
              </section>
            </div>
            <aside className="sidebar-stack">
              <section className="shortcut-banner">
                <p>바로가기 배너</p>
                <h3>긴급 대응 자료</h3>
                <span>오늘 필요한 문서와 가이드를 빠르게 찾을 수 있습니다.</span>
              </section>
              <section className="bookmark-panel">
                <div className="section-heading">
                  <div>
                    <p>북마크</p>
                    <h2>우측 바로가기</h2>
                  </div>
                </div>
                <div className="bookmark-list">
                  {bookmarks.map((bookmark) => (
                    <a href={bookmark.href} key={bookmark.id}>
                      {bookmark.name}
                    </a>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        );
    }
  }

  if (!currentMember) {
    return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div className="brand-block">
            <p className="brand-kicker">폐쇄형 내부 포털</p>
            <h1>CATS 분과</h1>
            <p>
              관리자에 사전 등록된 회원만 휴대전화와 지정된 패스워드로 접속할 수
              있습니다.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              휴대전화
              <input
                inputMode="numeric"
                value={phone}
                onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
                placeholder="숫자만 입력"
                required
              />
            </label>
            <label>
              지정 패스워드
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="패스워드 입력"
                required
              />
            </label>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit">접속하기</button>
          </form>

          <div className="auth-help">
            <strong>테스트 계정</strong>
            <span>관리자: 01012345678 / CATS2026</span>
            <span>회원: 01098765432 / MEDIA2026</span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="portal-shell">
      <header className="topbar">
        <div className="logo-block">
          <span className="logo-mark">C</span>
          <div>
            <p>CATS 분과</p>
            <strong>Closed Access Dashboard</strong>
          </div>
        </div>
        <div className="topbar-menu">
          <button type="button" onClick={() => setActiveMenu("dashboard")}>
            로고
          </button>
          <span>접속시간 {loginTime}</span>
          <span>
            {currentMember.name} | {currentMember.organization}
          </span>
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <nav className="gnb">
        {gnbItems.map((item) => (
          <button
            type="button"
            key={item.key}
            className={activeMenu === item.key ? "is-active" : ""}
            onClick={() => handleMenuChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <section className="welcome-band">
        <div>
          <p>환영합니다</p>
          <h2>{currentMember.name}님 전용 업무 대시보드</h2>
        </div>
        <span>미사용 5분 경과 시 자동 로그아웃</span>
      </section>

      {renderMainContent()}

      <footer className="footer">
        <span>copyright cats분과</span>
        {currentMember.isAdmin ? (
          <button
            type="button"
            className="admin-lock"
            onClick={() => handleMenuChange("admin")}
            aria-label="관리자모드 진입"
          >
            lock
          </button>
        ) : (
          <span />
        )}
      </footer>
    </main>
  );
}
