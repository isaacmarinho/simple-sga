#!/usr/bin/env /bin/bash

export PROJECT_UI_FOLDER="../../../environmental/dist/sga-app"
export CLOUD_FRONT_PROJECT_ID="<CLOUD_FRONT_PROJECT_ID>"

# sga-app
aws s3 sync --profile simple-sga "$PROJECT_UI_FOLDER" s3://simple-sga-app/  --delete --exclude "*.svg"

aws s3 cp --profile simple-sga "$PROJECT_UI_FOLDER" s3://simple-sga-app/ --recursive --exclude "*" --include "*.svg" --content-type "image/svg+xml"

aws cloudfront create-invalidation --profile simple-sga --distribution-id $CLOUD_FRONT_PROJECT_ID --paths '/*'