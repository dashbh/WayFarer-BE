# Your DockerHub username
DOCKER_USER=dashbh

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
