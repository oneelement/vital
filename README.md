# vital-frontend-task

This is a blank project to start the task with. You are expected to add all the necessary files and folders to complete the task.
This provides you with a Dockerfile to build the image and run the project, which expects a `yarn start` command to be available.

## Running the project

Build the image:

`docker build -t vital .`

To run this project:

`docker run --rm -p 8000:8000 vital`