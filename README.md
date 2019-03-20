<img align="right" src="https://raw.githubusercontent.com/startxfr/docker-images/master/travis/logo-small.svg?sanitize=true">

# docker-images-example-nodejs


Example of a micro-application using the startx s2i builder [startx/sv-nodejs](https://hub.docker.com/r/startx/sv-nodejs). 
For more information on how to use this image, **[read startx nodejs image guideline](https://github.com/startxfr/docker-images/blob/master/Services/nodejs/README.md)**.

## Running this example in OKD (aka Openshift)

### Create a sample application

```bash
# Create a openshift project
oc new-project startx-example-nodejs
# start a new application (build and run)
oc process -f https://raw.githubusercontent.com/startxfr/docker-images/master/Services/nodejs/openshift-template-build.yml -p APP_NAME=myapp | oc create -f -
# Watch when resources are available
sleep 30 && oc get all
```

### Create a personalized application

- **Initialize** a project
  ```bash
  export MYAPP=myapp
  oc new-project ${MYAPP}
  ```
- **Add template** to the project service catalog
  ```bash
  oc create -f https://raw.githubusercontent.com/startxfr/docker-images/master/Services/nodejs/openshift-template-build.yml -n startx-example-nodejs
  ```
- **Generate** your current application definition
  ```bash
  export MYVERSION=0.1
  oc process -n startx-example-nodejs -f startx-nodejs-build-template \
      -p APP_NAME=v${MYVERSION} \
      -p APP_STAGE=example \
      -p BUILDER_TAG=latest \
      -p SOURCE_GIT=https://github.com/startxfr/docker-images-example-nodejs.git \
      -p SOURCE_BRANCH=master \
      -p MEMORY_LIMIT=256Mi \
  > ./${MYAPP}.definitions.yml
  ```
- **Review** your resources definition stored in `./${MYAPP}.definitions.yml`
- **build and run** your application
  ```bash
  oc create -f ./${MYAPP}.definitions.yml -n startx-example-nodejs
  sleep 15 && oc get all
  ```
- **Test** your application
  ```bash
  oc describe route -n startx-example-nodejs
  curl http://<url-route>
  ```

## Running this example with source-to-image (aka s2i)

### Create a sample application

```bash
# Build the application
s2i build https://github.com/startxfr/docker-images-example-nodejs startx/sv-nodejs startx-nodejs-sample
# Run the application
docker run --rm -d -p 8777:8080 startx-nodejs-sample
# Test the sample application
curl http://localhost:8777
```

### Create a personalized application

- **Initialize** a project directory
  ```bash
  git clone https://github.com/startxfr/docker-images-example-nodejs.git nodejs-myapp
  cd nodejs-myapp
  rm -rf .git
  ```
- **Develop** and create a micro-service
  ```bash
  cat << "EOF"
  var http = require('http');
  var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello World, i'm an example\n");
  });
  server.listen(8080);
  console.log("Example server is running");
  EOF > app.js
  ```
- **Build** your current application with startx nodejs builder
  ```bash
  s2i build . startx/sv-nodejs:latest startx-nodejs-myapp
  ```
- **Run** your application and test it
  ```bash
  docker run --rm -d -p 8777:8080 startx-nodejs-myapp
  ```
- **Test** your application
  ```bash
  curl http://localhost:8777
  ```
