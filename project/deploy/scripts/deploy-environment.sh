#!/usr/bin/env /bin/bash

export AWS_REGISTRY_URI="${AWS_ID}.dkr.ecr.us-east-1.amazonaws.com"
export AWS_REGISTRY_ENVIRONMENTAL_IMAGE="${AWS_REGISTRY_URI}/simple-sga-environmental:latest"
export AWS_REGISTRY_APP_IMAGE="${AWS_REGISTRY_URI}/sga-app:latest"
export PROJECT_UI_FOLDER="../../../environmental/dist/sga-app"
export CLOUD_FRONT_PROJECT_ID="<CLOUD_FRONT_PROJECT_ID>"

# environmental
aws ecr get-login-password --region us-east-1 --profile simple-sga | docker login --username AWS --password-stdin $AWS_REGISTRY_URI

docker build -t simple-sga-environmental:latest -f environmental/deploy/Dockerfile .

docker tag simple-sga-environmental:latest $AWS_REGISTRY_ENVIRONMENTAL_IMAGE

docker AWS_REGISTRY_ENVIRONMENTAL_IMAGE

aws ecs update-service --profile simple-sga --cluster simple-sga-cluster --service simple-sga-environmental-service --task-definition simple-sga-environmental-task --region us-east-1 --force-new-deployment

# sga-app

aws ecr get-login-password --region us-east-1 --profile simple-sga | docker login --username AWS --password-stdin $AWS_REGISTRY_URI

docker build -t sga-app:latest -f ./sga-app/deploy/Dockerfile .

docker tag sga-app:latest $AWS_REGISTRY_APP_IMAGE

docker push $AWS_REGISTRY_APP_IMAGE

aws ecs update-service --profile simple-sga --cluster simple-sga-cluster --service simple-sga-app-service --task-definition simple-sga-app-task --region us-east-1 --force-new-deployment

aws s3 sync --profile simple-sga "$PROJECT_UI_FOLDER" s3://simple-sga-app/  --delete --exclude "*.svg"

aws s3 cp --profile simple-sga "$PROJECT_UI_FOLDER" s3://simple-sga-app/ --recursive --exclude "*" --include "*.svg" --content-type "image/svg+xml"

aws cloudfront create-invalidation --profile simple-sga --distribution-id $CLOUD_FRONT_PROJECT_ID --paths '/*'