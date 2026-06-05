export const INTERESTS = [
  "Hiking", "Gaming", "Coffee", "Gym", "Coding", "Art", "Music", "Movies",
  "Reading", "Cooking", "Travel", "Photography", "Yoga", "Dance", "Sports",
  "Anime", "Netflix", "Podcast", "Startup", "Research", "Hackathons",
  "Basketball", "Soccer", "Tennis", "Swimming", "Cycling", "Running",
  "Board Games", "Chess", "Volunteering", "Greek Life", "Study Groups",
];

export const SCHOOL_YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad Student"];

export const MAJORS = [
  "Computer Science", "Informatics", "Software Engineering", "Data Science",
  "Business Administration", "Biology", "Psychology", "Economics",
  "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering",
  "Mathematics", "Statistics", "Political Science", "Sociology",
  "English", "History", "Physics", "Chemistry", "Undeclared",
];

export const MOCK_MATCHES = [
  {
    id: "match-1",
    email: "priya.sharma@uci.edu",
    name: "Priya Sharma",
    major: "Computer Science",
    year: "Junior",
    interests: ["Coding", "Hiking", "Coffee", "Hackathons"],
    classes: ["CS 161", "IN4MATX 124", "STATS 120"],
    score: 87,
    avatar: null,
    initials: "PS",
    bio: "Love building things and exploring trails around Irvine!",
    matchedOn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "match-2",
    email: "marcus.chen@uci.edu",
    name: "Marcus Chen",
    major: "Data Science",
    year: "Senior",
    interests: ["Gaming", "Coding", "Anime", "Board Games"],
    classes: ["CS 161", "STATS 120", "IN4MATX 124"],
    score: 74,
    avatar: null,
    initials: "MC",
    bio: "Senior DS major, TA for intro stats. Always down to grab boba.",
    matchedOn: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
  {
    id: "match-3",
    email: "aisha.johnson@uci.edu",
    name: "Aisha Johnson",
    major: "Informatics",
    year: "Sophomore",
    interests: ["Art", "Photography", "Music", "Coffee"],
    classes: ["IN4MATX 124", "IN4MATX 131", "COMPSCI 122A"],
    score: 61,
    avatar: null,
    initials: "AJ",
    bio: "INF soph, obsessed with UX and film photography.",
    matchedOn: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
  },
];

export const DEMO_ACCOUNT_MATCH = {
  id: "demo-account",
  email: "demo.anteater@uci.edu",
  name: "Demo Anteater",
  major: "Informatics",
  year: "Junior",
  interests: ["Coding", "Coffee", "Study Groups", "Hackathons"],
  classes: ["IN4MATX 124", "CS 161", "STATS 120"],
  score: 92,
  avatar: null,
  initials: "DA",
  bio: "Demo account for testing two-sided ZotMate messaging.",
  matchedOn: new Date(Date.now() - 24 * 60 * 60 * 1000),
};

export function getVisibleMatchesForEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const isHardcodedMatch = MOCK_MATCHES.some((match) => match.email === normalizedEmail);

  if (!isHardcodedMatch) return MOCK_MATCHES;

  return [
    DEMO_ACCOUNT_MATCH,
    ...MOCK_MATCHES.filter((match) => match.email !== normalizedEmail),
  ];
}

export function getMatchByIdForEmail(id, email) {
  return getVisibleMatchesForEmail(email).find((match) => match.id === id);
}

export function getDemoProfileForEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (normalizedEmail === DEMO_ACCOUNT_MATCH.email) {
    return {
      uid: `demo-${normalizedEmail}`,
      firstName: "Demo",
      lastName: "Anteater",
      schoolEmail: DEMO_ACCOUNT_MATCH.email,
      schoolYear: DEMO_ACCOUNT_MATCH.year,
      major: DEMO_ACCOUNT_MATCH.major,
      majorId: "fallback-informatics",
      classes: DEMO_ACCOUNT_MATCH.classes.map((code) => ({ id: code, code, title: "Demo Course" })),
      interests: DEMO_ACCOUNT_MATCH.interests,
      iAm: "Student",
      lookingFor: "Study partners",
      isOnboarded: true,
    };
  }

  const match = MOCK_MATCHES.find((item) => item.email === normalizedEmail);
  if (!match) return null;

  const [firstName, ...lastParts] = match.name.split(" ");
  return {
    uid: `demo-${normalizedEmail}`,
    firstName,
    lastName: lastParts.join(" ") || "Student",
    schoolEmail: match.email,
    schoolYear: match.year,
    major: match.major,
    majorId: `fallback-${match.major.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    classes: match.classes.map((code) => ({ id: code, code, title: "Demo Course" })),
    interests: match.interests,
    iAm: "Student",
    lookingFor: "Study partners",
    isOnboarded: true,
  };
}

/** Current round's featured match (first in `MOCK_MATCHES`); identity stays hidden until Reveal. */
export const WEEKLY_FEATURED_MATCH_ID = MOCK_MATCHES[0]?.id ?? null;

export const MOCK_MESSAGES = {
  "match-1": [
    { id: "m1", senderEmail: "priya.sharma@uci.edu", text: "Hey! Looks like we're both in IN4MATX 124 😊", createdAt: Date.now() - 3600000 * 5 },
    { id: "m2", senderEmail: "demo.anteater@uci.edu", text: "Yes! Are you enjoying the class so far?", createdAt: Date.now() - 3600000 * 4 },
    { id: "m3", senderEmail: "priya.sharma@uci.edu", text: "It's a lot of work but really interesting. Working on the project rn actually", createdAt: Date.now() - 3600000 * 3 },
    { id: "m4", senderEmail: "demo.anteater@uci.edu", text: "Same! We should study together sometime", createdAt: Date.now() - 3600000 * 2 },
    { id: "m5", senderEmail: "priya.sharma@uci.edu", text: "Definitely! Aldrich library tomorrow?", createdAt: Date.now() - 3600000 },
  ],
  "match-2": [
    { id: "m6", senderEmail: "marcus.chen@uci.edu", text: "Yo! Fellow CS 161 survivor 😅", createdAt: Date.now() - 86400000 * 2 },
    { id: "m7", senderEmail: "demo.anteater@uci.edu", text: "Haha that midterm was brutal", createdAt: Date.now() - 86400000 * 2 + 60000 },
  ],
  "match-3": [],
};

// Next Monday midnight for countdown
export function getNextMatchDate() {
  const now = new Date();
  const day = now.getDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday;
}

/** Start of the current weekly match round (most recent Monday 00:00 local). */
export function getMatchRoundStartDate() {
  const now = new Date();
  const day = now.getDay();
  const daysSinceMonday = (day + 6) % 7;
  const start = new Date(now);
  start.setDate(now.getDate() - daysSinceMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

/** Stable id for this week's match; changes when a new match round begins (each Monday). */
export function getMatchRoundId() {
  return getMatchRoundStartDate().toISOString();
}
