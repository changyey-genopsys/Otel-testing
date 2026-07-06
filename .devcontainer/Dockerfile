# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/devcontainers/javascript-node@sha256:f40f56e383d544349e89ca05afac31a3569cade5ae10ce5d3d04ccfdb6c6648c

# Install system dependencies and cleanup to keep the image small
RUN apt-get update && \
    apt-get install -y curl iputils-ping lcov && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /workspace