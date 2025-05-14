#!/usr/bin/env bash
set -x

ruff check app scripts tests --fix
ruff format app scripts tests
