#!/bin/bash
cd /home/simon/ooss

# Delete the old RestTemplate-based FormServiceClient
rm -f backend/order-service/src/main/java/com/oss2/orderservice/client/FormServiceClient.java

# Delete the local DTOs
rm -f backend/order-service/src/main/java/com/oss2/orderservice/dto/FormSchemaDTO.java
rm -f backend/order-service/src/main/java/com/oss2/orderservice/dto/FormSubmissionDTO.java

echo "✓ Deleted deprecated FormServiceClient and local DTOs"
echo "✓ Order-service now uses only the FeignClient from common-form-client"

# Verify the files are deleted
echo ""
echo "Verifying deletion..."
if [ ! -f backend/order-service/src/main/java/com/oss2/orderservice/client/FormServiceClient.java ]; then
    echo "✓ FormServiceClient.java deleted"
else
    echo "✗ FormServiceClient.java still exists"
fi

if [ ! -f backend/order-service/src/main/java/com/oss2/orderservice/dto/FormSchemaDTO.java ]; then
    echo "✓ FormSchemaDTO.java deleted"
else
    echo "✗ FormSchemaDTO.java still exists"
fi

if [ ! -f backend/order-service/src/main/java/com/oss2/orderservice/dto/FormSubmissionDTO.java ]; then
    echo "✓ FormSubmissionDTO.java deleted"
else
    echo "✗ FormSubmissionDTO.java still exists"
fi
