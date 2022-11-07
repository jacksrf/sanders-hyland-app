#!/usr/bin/env bash
docker build -t auth0-react-02-calling-an-api .
docker run --init -p 3002:3002 -p 3003:3003 -it auth0-react-02-calling-an-api
