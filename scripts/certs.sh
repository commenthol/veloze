#!/usr/bin/env sh
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

TARGET="$CWD"/../test/support/certs/foo.bar

openssl req -x509 \
  -newkey rsa:2048 \
  -nodes -sha256 \
  -subj '/CN=foo.bar' \
  -keyout "$TARGET".key \
  -out "$TARGET".crt
