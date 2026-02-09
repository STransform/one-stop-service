#!/bin/bash

# Create proper directory structure
mkdir -p src/main/java/com/oss2/formservice/model
mkdir -p src/main/java/com/oss2/formservice/repository
mkdir -p src/main/java/com/oss2/formservice/controller

# Move files to correct locations
if [ -f "model/FormSchema.java" ]; then
    mv model/FormSchema.java src/main/java/com/oss2/formservice/model/
fi

if [ -f "model/FormSubmission.java" ]; then
    mv model/FormSubmission.java src/main/java/com/oss2/formservice/model/
fi

if [ -f "repository/FormSchemaRepository.java" ]; then
    mv repository/FormSchemaRepository.java src/main/java/com/oss2/formservice/repository/
fi

if [ -f "repository/FormSubmissionRepository.java" ]; then
    mv repository/FormSubmissionRepository.java src/main/java/com/oss2/formservice/repository/
fi

if [ -f "controller/FormController.java" ]; then
    mv controller/FormController.java src/main/java/com/oss2/formservice/controller/
fi

if [ -f "controller/SubmissionController" ]; then
    mv controller/SubmissionController src/main/java/com/oss2/formservice/controller/SubmissionController.java
fi

# Remove empty directories
rmdir model 2>/dev/null
rmdir repository 2>/dev/null
rmdir controller 2>/dev/null

echo "Files moved successfully!"
echo "Directory structure:"
tree src/ -L 5 2>/dev/null || find src/ -type f
