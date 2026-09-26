# Landing page + extension download, built by Coolify from the repo root:
#   Base Directory: /    Dockerfile Location: /landing/Dockerfile    Port: 80
# Every deploy rebuilds the minified extension zip from extension/ (npm run build:ext),
# so pushing to main is the whole release.

FROM node:22-alpine AS build
RUN apk add --no-cache zip
WORKDIR /repo
# Only esbuild is needed; the root package.json pulls in the heavy WebGPU-demo deps.
RUN npm init -y >/dev/null && npm install --no-save esbuild@0.25.12
COPY scripts/build-extension.mjs scripts/
COPY extension/ extension/
RUN node scripts/build-extension.mjs --zip \
 && mkdir /download \
 && version=$(node -p "require('./extension/manifest.json').version") \
 && cp "dist/rightmate-${version}.zip" /download/rightmate.zip \
 && cp "dist/rightmate-${version}.zip" /download/ \
 && printf '{"version":"%s"}\n' "$version" > /download/version.json

FROM nginx:alpine
COPY landing/nginx.conf /etc/nginx/conf.d/default.conf
COPY landing/index.html landing/rightmate-mark.png landing/rightmate-wordmark.png /usr/share/nginx/html/
COPY --from=build /download/ /usr/share/nginx/html/download/
