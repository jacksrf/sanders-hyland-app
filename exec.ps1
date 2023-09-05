docker build --rm -t auth0-react-01-login .
docker run --init -p 3002:3002 -p 3003:3003 -it auth0-react-01-login
