import express, { Request, Response, NextFunction} from "express";
import nunjucks from "nunjucks";
import path from "path";
import { updates } from "./updates.js";
import { postsDict } from "./postsDict.js"
// import postsDict from "./postsDict.json" with { type: "json" };
// import { createRequire } from "module"; 
import fs from 'fs';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const postsDict = require("./postsDict.json") as Record<string, string>;
// const postsTitleMap: Record<string, string> = postsDict; 

function getPostList() {
    const mdDir  = path.join(__dirname, "../source/posts");
    const njkDir = path.join(__dirname, "../source/views/posts");

    // 1. Load Markdown posts
    const mdFiles = fs.existsSync(mdDir)
        ? fs.readdirSync(mdDir).filter(f => f.endsWith(".md"))
        : [];

    // 2. Load Nunjucks template posts
    const njkFiles = fs.existsSync(njkDir)
        ? fs.readdirSync(njkDir).filter(f => f.endsWith(".njk"))
        : [];

    const mdPosts = mdFiles.map(file => {
        const slug = file.replace(".md", "");
        // const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        const title =
            postsDict[slug] ??
            slug.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return { slug, title, url: `/posts/${slug}`, type: "md" };
    });

    const njkPosts = njkFiles.map(file => {
        const slug = file.replace(".njk", "");
        const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
        return { slug, title, url: `/posts/${slug}`, type: "njk" };
    });

    return [...mdPosts, ...njkPosts];
}

const app = express();

nunjucks.configure(path.join(__dirname, '../source/views'), {
    autoescape: true, 
    express: app
});

const postRoutes = [
    { path: '/post/writing1', template: 'post/writing1.njk' },
    { path: '/post/writing-conda', template: 'post/writing-conda.njk' },
    { path: '/post/writing-matplotlib', template: 'post/writing-matplotlib.njk' }
];

postRoutes.forEach(route => {
    app.get(route.path, (req: Request, res: Response) => {
        res.render(route.template);
    });
});

// Serving the post files.
app.use('/posts', express.static(path.join(__dirname, '../source/posts')));

app.get('/posts/:slug', async (req, res) => {
    // const rawSlug = req.params.slug;
    // const slug = rawSlug.toLowerCase();

    const slug = req.params.slug;

    const mdPath  = path.join(__dirname, '../source/posts', `${slug}.md`);
    const njkPath = path.join(__dirname, '../source/views/posts', `${slug}.njk`);

    if (fs.existsSync(mdPath)) {
        const { marked } = await import("marked");
        const markdown = fs.readFileSync(mdPath, 'utf8');
        const html = marked(markdown);
        return res.render('post_template.njk', { html });
    }

    if (fs.existsSync(njkPath)) {
        return res.render(`posts/${slug}.njk`);
    }

    return res.status(404).send("Post not found");
});

// Landing page 
app.get('/', function(Request, Response) {
    Response.render('home.njk', { updates });
})

// Serving the static files 
app.use('/', express.static(path.join(__dirname, '../source/static')));

// Professional experience page 
app.get('/experience', function(Request, Response) {
    Response.render('exp.njk');
})

// Academia page 
app.get('/education', function(Request, Response) {
    Response.render('edu.njk');
})

// Posts page
app.get('/skill', function (req: Request, res: Response) {
    const posts = getPostList();
    res.render('skill.njk', { posts });
});

// Contact page 
app.get('/contact', function(Request, Response) {
    Response.render('contact.njk');
})

// Localhost for debugging...
app.listen(process.env.PORT || 3000, 
    () => console.log("Server is running at http://localhost:3000..."));

// Hidden pages
app.get('/how_to_bible', function(Request, Response) {
    Response.render('bible.njk');
})

app.get('/how_to_bible/leviticus', function(Request, Response) {
    Response.render('bible/leviticus.njk');
})