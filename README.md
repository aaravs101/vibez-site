# vibez-site

The landing page for Vibez. Plain HTML and CSS, no build step.

- `index.html`: the page
- `style.css`: styles
- `assets/`: logo, icons and the Site canvas screenshot

Preview locally by opening `index.html` in a browser, or run `npx serve .`

## Deploying

Any static host works (Vercel, Netlify, Cloudflare Pages). Point it at this repo
with no build command and `/` as the output directory. Then add the custom
domain in the host's dashboard and create the DNS records it shows at the
domain's registrar.
