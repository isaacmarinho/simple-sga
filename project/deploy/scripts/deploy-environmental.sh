#!/usr/bin/env /bin/bash

export AWS_REGISTRY_URI="${AWS_ID}.dkr.ecr.us-east-1.amazonaws.com"
export AWS_REGISTRY_ENVIRONMENTAL_IMAGE="${AWS_REGISTRY_URI}/simple-sga-environmental:latest"

# environmental
aws ecr get-login-password --region us-east-1 --profile simple-sga | docker login --username AWS --password-stdin "$AWS_REGISTRY_URI"

docker build -t simple-sga-environmental:latest -f environmental/deploy/Dockerfile .

docker tag simple-sga-environmental:latest "$AWS_REGISTRY_ENVIRONMENTAL_IMAGE"

docker push "$AWS_REGISTRY_ENVIRONMENTAL_IMAGE"

aws ecs update-service --profile simple-sga --cluster simple-sga-cluster --service simple-sga-environmental-service --task-definition simple-sga-environmental-task --region us-east-1 --force-new-deployment