# Makefile for building and pushing Docker images for microservices
# Load only DOCKER_USER from .env file if present
ifneq (,$(wildcard .env))
	include .env
	export DOCKER_USER
endif

# Ensure DOCKER_USER is defined
ifndef DOCKER_USER
  $(error DOCKER_USER is not set. Define it in .env or via environment variable)
endif

# List of your microservices
SERVICES=api-gateway wayfarer-auth wayfarer-catalog wayfarer-cart

# Docker context is the root (.) so it includes shared files
BUILD_CONTEXT=.

# Build and tag each service
build:
	@for service in $(SERVICES); do \
		echo "🔨 Building $$service..."; \
		docker build \
			-t $(DOCKER_USER)/$$service:latest \
			--file apps/$$service/Dockerfile \
			$(BUILD_CONTEXT); \
	done

# Push each built image to Docker Hub
push:
	@for service in $(SERVICES); do \
		echo "📤 Pushing $$service..."; \
		docker push $(DOCKER_USER)/$$service:latest; \
	done

# Build and push everything
all: build push
