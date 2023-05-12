#!/usr/bin/env /bin/bash

export AWS_REGISTRY_URI="${AWS_ID}.dkr.ecr.us-east-1.amazonaws.com"
export AWS_REGISTRY_MESSAGING_IMAGE="${AWS_REGISTRY_URI}/simple-sga-messaging:latest"

# messaging
aws ecr get-login-password --region us-east-1 --profile simple-sga | docker login --username AWS --password-stdin "$AWS_REGISTRY_URI"

docker build -t simple-sga-messaging:latest -f messaging/deploy/Dockerfile .

docker tag simple-sga-messaging:latest "$AWS_REGISTRY_MESSAGING_IMAGE"

docker push "$AWS_REGISTRY_MESSAGING_IMAGE"

aws ecs update-service --profile simple-sga --cluster simple-sga-cluster --service simple-sga-messaging-service --task-definition simple-sga-messaging-task --region us-east-1 --force-new-deployment