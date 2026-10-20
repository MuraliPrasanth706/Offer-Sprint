"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logout } from "@/lib/actions";
import ThemeToggle from "../ThemeToggle";

const I = {
  today: <path d="M3 10h18M8 3v4M16 3v4M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />,
  log: <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6.5A2.5 2.5 0 0 0 4 21.5zM4 19.5A2.5 2.5 0 0 1 6.5 17H19M9 7h6M9 11h4" />,
  days: <path d="M9 11l3 3 8-8M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" />,
  apps: <path d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />,
  interviews: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5" />,
  prep: <path d="M12 2l9 5-9 5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />,
  dsa: <path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16" />,
  plan: <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14" />,
};

const LINKS: { href: string; label: string; icon: keyof typeof I }[] = [
  { href: "/learnings", label: "My Log", icon: "log" },
  { href: "/dsa", label: "DSA", icon: "dsa" },
  { href: "/prep", label: "Core prep", icon: "prep" },
  { href: "/interviews", label: "Interviews", icon: "interviews" },
  { href: "/applications", label: "Applications", icon: "apps" },
  { href: "/plan", label: "Plan", icon: "plan" },
];

function Icon({ d }: { d: React.ReactNode }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
  );
}

export default function Sidebar({ dayLabel, progress }: { dayLabel: string; progress: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]); // close the mobile drawer after navigating

  const brand = (
    <div className="brand">
      <span className="logo" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7" /></svg>
      </span>
      Offer Sprint
    </div>
  );

  return (
    <>
      {/* phone: slim top bar with a menu button */}
      <div className="mtop">
        {brand}
        <button type="button" className="theme-btn" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="sidebar" onClick={() => setOpen(!open)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {open ? <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" /> : null}

      <aside id="sidebar" className={`side ${open ? "open" : ""}`} aria-label="Sidebar">
        <div className="side-brand">{brand}</div>

        <nav className="side-nav" aria-label="Main">
          {LINKS.map((l) => {
            const on = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
                <Icon d={I[l.icon]} />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="side-foot">
          <div className="side-day">
            <div className="row between small"><span className="mono">{dayLabel}</span><span className="mono muted">{progress}%</span></div>
            <div className="bar" style={{ marginTop: 8 }}><span style={{ width: `${progress}%` }} /></div>
            <div className="small muted" style={{ marginTop: 6 }}>Last day: Dec 20</div>
          </div>
          <div className="row between">
            <form action={logout}>
              <button className="side-out">
                <Icon d={<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />} />
                <span>Log out</span>
              </button>
            </form>
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </>
  );
}
