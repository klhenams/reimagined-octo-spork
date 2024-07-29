#!/usr/bin/env bash

set -e
set -x

uvicorn rms.main:app --port 9002 --host 0.0.0.0
