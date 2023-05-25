#!/usr/bin/env /bin/bash

export AWS_REGISTRY_URI="${AWS_ID}.dkr.ecr.us-east-1.amazonaws.com"
export AWS_REGISTRY_ATTACHMENT_IMAGE="${AWS_REGISTRY_URI}/simple-sga-attachment:latest"

# attachment
aws ecr get-login-password --region us-east-1 --profile simple-sga | docker login --username AWS --password-stdin "$AWS_REGISTRY_URI"

docker build -t simple-sga-attachment:latest -f attachment/deploy/Dockerfile .

docker tag simple-sga-attachment:latest "$AWS_REGISTRY_ATTACHMENT_IMAGE"

docker push "$AWS_REGISTRY_ATTACHMENT_IMAGE"

aws ecs update-service --profile simple-sga --cluster simple-sga-cluster --service simple-sga-attachment-service --task-definition simple-sga-attachment-task --region us-east-1 --force-new-deployment