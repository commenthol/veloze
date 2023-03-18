#!/usr/bin/env sh
CWD=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

TARGET="$CWD"/../test/support/certs/foo.bar

openssl req -x509 \
	-newkey rsa:2048 \
	-nodes -sha256 \
	-subj '/CN=foo.bar' \
	-keyout "$TARGET".key \
	-out "$TARGET".crt

echo "foobar" > "$TARGET".pass

openssl pkcs12 -export \
	-certpbe PBE-SHA1-3DES \
	-passout "file:$TARGET.pass" \
	-in "$TARGET".crt \
	-inkey "$TARGET".key \
	-out "$TARGET".pfx

## introspect pfx certificate
# openssl pkcs12 -info -in "$TARGET".pfx -nodes
