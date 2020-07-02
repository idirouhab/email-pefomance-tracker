#!/bin/bash

set -e

# run semantic-release
~/semantic-release -vf --allow-no-changes
export VERSION=$(cat .version)

# docker build
export IMAGE_NAME="idirouhab/email-tracker"
export IMAGE_NAME_VERSION="$IMAGE_NAME:$VERSION"

docker build -t $IMAGE_NAME_VERSION .
docker tag $IMAGE_NAME_VERSION $IMAGE_NAME

# push to docker hub
docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
docker push $IMAGE_NAME_VERSION
docker push $IMAGE_NAME