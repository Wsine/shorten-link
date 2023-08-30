# Shorten Link

It is self-hosted service for shortening link.

## Motivation

**Why self-hosted?**

Self-hosted can get rid of the registration step so that we can also avoid the alias conflicting with those of other users.

**How to avoid attacks without registration?**

I used a very simple symmetric encryption to protect critical operations (i.e., just a string, lol).

**Any more?**

I don't need the tracking feature that most out-of-the-shelf services provide.

## How to deploy

- Clone this repository
- New a project in Cloudflare Pages and link to the cloned repo
- Set the environment variable `AUTH_HEADER_VALUE` as what you want
  - recommended to generate from https://www.uuidgenerator.net/


## How to develop

```bash
# Clone this repository
git clone https://github.com/Wsine/shorten-link.git
cd shorten-link
# Install the dependencies
npm install
# Set environment variable
echo 'AUTH_HEADER_VALUE="c516aaea-1c27-4cec-ad9c-240ba1059396"' >> .dev.vars
# Bootstrap
npm run dev
```

