#!/usr/bin/env /bin/bash

export AWS_ID="510463452646"
export AWS_REGISTRY_URI="${AWS_ID}.dkr.ecr.us-east-1.amazonaws.com"
export AWS_REGISTRY_CORE_IMAGE="simple-sga-core:latest"
export AWS_REGISTRY_CORE_IMAGE_URI="${AWS_REGISTRY_URI}/${AWS_REGISTRY_CORE_IMAGE}"

# environmental
aws ecr get-login-password --region us-east-1 --profile simple-sga | docker login --username AWS --password-stdin "$AWS_REGISTRY_URI"

docker build -t "$AWS_REGISTRY_CORE_IMAGE" -f core/deploy/Dockerfile .

docker tag "$AWS_REGISTRY_CORE_IMAGE" "$AWS_REGISTRY_CORE_IMAGE_URI"

docker push  "$AWS_REGISTRY_CORE_IMAGE_URI"

aws ecs update-service --profile simple-sga --cluster simple-sga-cluster --service simple-sga-core-service --task-definition simple-sga-core-task --region us-east-1 --force-new-deployment