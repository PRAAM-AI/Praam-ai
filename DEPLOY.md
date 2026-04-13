# Deploying `praamai.com`

This app is a static site. The simplest production deployment is:

1. Point `praamai.com` and `www.praamai.com` DNS to your server IP.
2. Copy this project onto the server.
3. Run `docker compose -f docker-compose.prod.yml up --build -d`.

The production stack uses:

- `web`: the static site container
- `caddy`: HTTPS termination and automatic Let's Encrypt certificates

## DNS

Create these records with your DNS provider:

- `A` record: `praamai.com` -> `<your_server_ipv4>`
- `A` record: `www.praamai.com` -> `<your_server_ipv4>`

If you use IPv6, also add:

- `AAAA` record: `praamai.com` -> `<your_server_ipv6>`
- `AAAA` record: `www.praamai.com` -> `<your_server_ipv6>`

## Server requirements

- A Linux VM or server with Docker and Docker Compose
- Ports `80` and `443` open to the public internet

## Deploy

From the project directory on the server:

```sh
docker compose -f docker-compose.prod.yml up --build -d
```

Then verify:

```sh
docker compose -f docker-compose.prod.yml ps
curl -I https://praamai.com
```

## Updates

After making site changes:

```sh
docker compose -f docker-compose.prod.yml up --build -d
```

## Notes

- TLS certificates are handled automatically by Caddy after DNS is pointed correctly.
- The current contact form is front-end only. It does not send submissions anywhere yet.
