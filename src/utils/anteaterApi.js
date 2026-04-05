const BASE = "https://api.anteaterapi.com/v2/rest";

export async function searchCoursesByName(query) {
  const res = await fetch(
    `${BASE}/courses?titleContains=${encodeURIComponent(query)}`,
  );
  return res.json();
}

export async function searchCoursesByCode(code) {
  const res = await fetch(
    `${BASE}/courses?courseNumber=${encodeURIComponent(code)}`,
  );
  return res.json();
}
