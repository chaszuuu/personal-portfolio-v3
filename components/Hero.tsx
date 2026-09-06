import ThemeToggle from "./ThemeToggle";

export default function Hero() {
  return (
    <section className="hero ">
      <div className="kicker">Hello there! I'm</div>

      <div className="hero-heading">
        <h1>Charles Vincent Panlilio</h1>
        <ThemeToggle />
        <div className="hero-avatar">
          <img src="/xd.jpg" alt="Charles Vincent Panlilio" />
        </div>
      </div>
      <div className="meta">
        <span>Software Developer</span>
        <span>QA Tester</span>
      </div>

      <div className="hero-grid">
        <div className="hero-main">
          <p className="about text-justify hyphens-auto">
            I'm an aspiring software developer and QA tester who enjoys building things from end to end. I
            work across the stack, from designing databases and building APIs to creating the interfaces
            that bring everything together — and I care just as much about making sure it actually works.

            
          </p>
          <p className="about text-justify hyphens-auto">
            Most of what I know comes from building real projects, figuring things out along the way, and
            learning by doing. I recently completed my degree in  Bachelor of Science in Information Technology and I'm looking for an entry-level developer
            or QA role where I can keep building, learn from others, and grow as a developer.
          </p>
          <div className="hero-links">
            <a className="primary" href="/resume.pdf" target="_blank" rel="noopener">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              Resume
            </a>
            <a href="mailto:panliliocharlesvincent@gmail.com">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              Email
            </a>
            <a href="https://github.com/chaszuuu" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              GitHub
            </a>
          </div>
        </div>

        <div className="hero-side">
          <div className="snapshot">
            <div className="snapshot-row">
              <span className="k">Role</span>
              <span className="v">Software Developer & QA Tester</span>
            </div>
            <div className="snapshot-row">
              <span className="k">Focus</span>
              <span className="v">Software Development & Testing</span>
            </div>
            <div className="snapshot-row">
              <span className="k">Based</span>
              <span className="v">San Fernando, Pampanga, PH</span>
            </div>
            <div className="snapshot-row">
              <span className="k">Status</span>
              <span className="v accent">Open to work</span>
            </div>
            <div className="snapshot-note">
              Currently polishing this portfolio —{" "}
              <b>reach out if you're hiring.</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}