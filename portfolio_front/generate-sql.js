const fs = require("fs");

const projects = JSON.parse(fs.readFileSync("./mockProjects.json", "utf-8"));

function escape(str) {
  return str ? `'${str.replace(/'/g, "''")}'` : "NULL";
}

projects.forEach((p, index) => {
  const sql = `
INSERT INTO project (
  id, slug, title, description, start_date, end_date, category,
  thumbnail_url, git_url, live_url, role, is_featured, active
) VALUES (
  ${index + 1},
  ${escape(p.id)},
  ${escape(p.title)},
  ${escape(p.description)},
  ${escape(p.startDate)},
  ${escape(p.endDate)},
  ${escape(p.category)},
  ${escape(p.thumbnailUrl)},
  ${escape(p.gitUrl)},
  ${escape(p.liveUrl)},
  ${escape(p.role)},
  ${p.isFeatured ? "TRUE" : "FALSE"},
  ${p.active ? "TRUE" : "FALSE"}
);
  `.trim();

  console.log(sql);
});
