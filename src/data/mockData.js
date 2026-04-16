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

export const MOCK_MESSAGES = {
  "match-1": [
    { id: "m1", senderId: "match-1", text: "Hey! Looks like we're both in IN4MATX 124 😊", createdAt: Date.now() - 3600000 * 5 },
    { id: "m2", senderId: "mock-uid-1", text: "Yes! Are you enjoying the class so far?", createdAt: Date.now() - 3600000 * 4 },
    { id: "m3", senderId: "match-1", text: "It's a lot of work but really interesting. Working on the project rn actually", createdAt: Date.now() - 3600000 * 3 },
    { id: "m4", senderId: "mock-uid-1", text: "Same! We should study together sometime", createdAt: Date.now() - 3600000 * 2 },
    { id: "m5", senderId: "match-1", text: "Definitely! Aldrich library tomorrow?", createdAt: Date.now() - 3600000 },
  ],
  "match-2": [
    { id: "m6", senderId: "match-2", text: "Yo! Fellow CS 161 survivor 😅", createdAt: Date.now() - 86400000 * 2 },
    { id: "m7", senderId: "mock-uid-1", text: "Haha that midterm was brutal", createdAt: Date.now() - 86400000 * 2 + 60000 },
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
