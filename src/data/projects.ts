export interface Project {
  slug: string;
  idx: string;
  letter: string;
  category: string;
  title: string;
  desc: string;
  stack: string[];
  isLight: boolean;
  image?: string;
  imageUrl?: string;
  imageFit?: "cover" | "contain" | "fill";
  imagePosition?: "center" | "top" | "bottom" | "left" | "right";
  imageScale?: number;
  longDescription?: string;
  role?: string;
  year?: string;
  liveUrl?: string;
  githubUrl?: string;
  metrics?: { label: string; value: string }[];
}

export const projects: Project[] = [
  {
    slug: "pulse",
    idx: "01",
    letter: "P",
    category: "Infrastructure / Systems",
    title: "Pulse",
    desc: "A real-time monitoring dashboard tracking the health of 40+ servers, with instant alerts the moment something breaks.",
    stack: ["Go", "React", "Redis", "WebSocket"],
    isLight: true,
    longDescription:
      "Pulse was engineered to solve high latency monitoring bottlenecks. Built with Go and Redis for blazing-fast event-driven architecture, it processes telemetry data from over 40 production servers simultaneously with sub-second incident alerts.",
    role: "Lead Systems Architect",
    year: "2024",
    liveUrl: "https://example.com/pulse",
    githubUrl: "https://github.com/example/pulse",
    metrics: [
      { label: "Servers Monitored", value: "40+" },
      { label: "Alert Latency", value: "< 250ms" },
      { label: "Uptime", value: "99.99%" },
    ],
  },
  {
    slug: "masar",
    idx: "02",
    letter: "M",
    category: "Mobile / Consumer App",
    title: "Masar",
    desc: "A fitness and nutrition tracker that logs meals and workouts through image recognition — no tedious manual entry.",
    stack: ["React Native", "Node.js", "MongoDB"],
    isLight: false,
    longDescription:
      "Masar simplifies holistic wellness tracking by replacing manual macro counting with intelligent visual recognition models. It delivers a fluid mobile experience used daily by health enthusiasts across the region.",
    role: "Full-Stack Mobile Engineer",
    year: "2023",
    liveUrl: "https://example.com/masar",
    githubUrl: "https://github.com/example/masar",
    metrics: [
      { label: "Active Users", value: "15,000+" },
      { label: "App Store Rating", value: "4.8 / 5" },
      { label: "Food Log Accuracy", value: "94%" },
    ],
  },
  {
    slug: "qcli",
    idx: "03",
    letter: "Q",
    category: "Developer Tools / Open Source",
    title: "qcli",
    desc: "An open-source command-line tool for managing background job queues with a minimal memory footprint.",
    stack: ["Rust"],
    isLight: true,
    longDescription:
      "qcli is a zero-dependency, ultra-lightweight CLI utility built in Rust to inspect, flush, and retry background jobs across distributed worker pools without loading heavy web consoles.",
    role: "Creator & Maintainer",
    year: "2023",
    liveUrl: "https://example.com/qcli",
    githubUrl: "https://github.com/example/qcli",
    metrics: [
      { label: "GitHub Stars", value: "1,200+" },
      { label: "Binary Size", value: "1.4 MB" },
      { label: "Execution Time", value: "< 12ms" },
    ],
  },
  {
    slug: "dars",
    idx: "04",
    letter: "D",
    category: "EdTech / Platform",
    title: "Dars",
    desc: "A learning platform teaching programming concepts in simplified Arabic, with 3,000+ learners enrolled.",
    stack: ["Next.js", "PostgreSQL", "Stripe"],
    isLight: false,
    longDescription:
      "Dars delivers interactive coding education tailored for Arabic speakers. Featuring real-time in-browser code execution, structured curricula, and seamless payment integration with Stripe.",
    role: "Founder & Full-Stack Developer",
    year: "2022",
    liveUrl: "https://example.com/dars",
    githubUrl: "https://github.com/example/dars",
    metrics: [
      { label: "Enrolled Learners", value: "3,000+" },
      { label: "Completion Rate", value: "78%" },
      { label: "Interactive Lessons", value: "120+" },
    ],
  },
];
