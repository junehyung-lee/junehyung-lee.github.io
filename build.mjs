import nunjucks from "nunjucks";
import { marked } from "marked";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const VIEWS   = path.join(__dirname, "web/source/views");
const POSTS   = path.join(__dirname, "web/source/posts");
const STATIC  = path.join(__dirname, "web/source/static");
const OUT     = path.join(__dirname, "docs");

// --- updates data (copied from updates.ts) ---
const updates = [
    {
        title: "Our first trip to South Korea as a whole family",
        date: "Dec 29, 2024",
        image: "home personal updates/whole family.png",
        text: "We visited Korea for the first time as a family of three. It was a quick trip — and freezing — but it was more than warm enough to completely melt the grandparents' hearts."
    },
    {
        title: "Wrapping up as an intern at Love's",
        date: "Aug 2, 2024",
        image: "home personal updates/loves wrap up.png",
        text: "As the summer of 2024 comes to an end, I also wrapped up my time as an intern at Love's. It was a truly meaningful experience that allowed me to grow both personally and professionally."
    },
    {
        title: "Celebrating our baby's 100th day!",
        date: "May 17, 2024",
        image: "home personal updates/100 cupcake.png",
        text: "In South Korea, we have a culture that celebrates a baby's 100th day since birth. We may be a little behind schedule, but here're cute cakes with toppers to celebrate our daughter's 100th!"
    },
    {
        title: "I've become a father!",
        date: "Feb 7, 2024",
        image: "home personal updates/father.png",
        text: "On February 7th, 2024, I finally became a father to a daughter. It was definitely a moment filled with joy as we welcomed her into the world."
    },
    {
        title: "Our baby is a girl!",
        date: "Sep 24, 2023",
        image: "gender_reveal.jpeg",
        text: "Our friends threw a beautiful gender reveal party for us. When we cut the cake, it revealed pink inside — it's a girl!"
    },
    {
        title: "A new family member just confirmed!",
        date: "Jul 12, 2023",
        image: "baby.jpg",
        text: "We went to the hospital and took the first ultrasound 'selfie' of our baby. We also heard the heartbeat — it was really fast!"
    },
    {
        title: "I've got married!",
        date: "Jun 18, 2022",
        image: "wedding.jpeg",
        text: "After 7 wonderful years of getting to know each other, my wife and I tied the knot and started a new chapter together."
    }
];

// --- postsDict ---
const postsDict = JSON.parse(fs.readFileSync(path.join(__dirname, "web/source/postsDict.json"), "utf8"));

// --- configure nunjucks ---
const env = nunjucks.configure(VIEWS, { autoescape: true });

// --- helpers ---
function write(filePath, html) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, html, "utf8");
    console.log("wrote", path.relative(__dirname, filePath));
}

function render(template, ctx = {}) {
    return env.render(template, ctx);
}

// --- collect posts ---
function getPostList() {
    const mdFiles = fs.existsSync(POSTS)
        ? fs.readdirSync(POSTS).filter(f => f.endsWith(".md"))
        : [];
    const njkDir = path.join(VIEWS, "posts");
    const njkFiles = fs.existsSync(njkDir)
        ? fs.readdirSync(njkDir).filter(f => f.endsWith(".njk"))
        : [];

    const mdPosts = mdFiles.map(file => {
        const slug = file.replace(".md", "");
        const title = postsDict[slug] ?? slug.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return { slug, title, url: `/posts/${slug}/`, type: "md" };
    });

    const njkPosts = njkFiles.map(file => {
        const slug = file.replace(".njk", "");
        const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return { slug, title, url: `/posts/${slug}/`, type: "njk" };
    });

    return [...mdPosts, ...njkPosts];
}

// --- clean & recreate docs ---
if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
fs.mkdirSync(OUT);

// --- main pages ---
write(path.join(OUT, "index.html"),           render("home.njk", { updates }));
write(path.join(OUT, "experience/index.html"), render("exp.njk"));
write(path.join(OUT, "education/index.html"),  render("edu.njk"));
write(path.join(OUT, "contact/index.html"),    render("contact.njk"));
write(path.join(OUT, "skill/index.html"),      render("skill.njk", { posts: getPostList() }));

// hidden pages
write(path.join(OUT, "how_to_bible/index.html"),            render("bible.njk"));
write(path.join(OUT, "how_to_bible/leviticus/index.html"),  render("bible/leviticus.njk"));

// old post routes
const legacyPosts = [
    { route: "post/writing1",          template: "post/writing1.njk" },
    { route: "post/writing-conda",     template: "post/writing-conda.njk" },
    { route: "post/writing-matplotlib", template: "post/writing-matplotlib.njk" },
];
for (const { route, template } of legacyPosts) {
    write(path.join(OUT, route, "index.html"), render(template));
}

// --- dynamic posts ---
const posts = getPostList();
for (const post of posts) {
    if (post.type === "md") {
        const markdown = fs.readFileSync(path.join(POSTS, `${post.slug}.md`), "utf8");
        const html = await marked(markdown);
        write(path.join(OUT, "posts", post.slug, "index.html"), render("post_template.njk", { html }));
    } else {
        write(path.join(OUT, "posts", post.slug, "index.html"), render(`posts/${post.slug}.njk`));
    }
}

// --- copy static assets ---
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(s, d);
        } else {
            fs.copyFileSync(s, d);
        }
    }
}
copyDir(STATIC, OUT);
console.log("copied static assets");

// --- 404 page (GitHub Pages uses 404.html) ---
const notFoundHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=/">
</head><body>Redirecting...</body></html>`;
write(path.join(OUT, "404.html"), notFoundHtml);

console.log("\nBuild complete → docs/");
