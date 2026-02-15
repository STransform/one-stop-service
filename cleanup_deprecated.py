import os

# Files to delete
files_to_delete = [
    'backend/order-service/src/main/java/com/oss2/orderservice/client/FormServiceClient.java',
    'backend/order-service/src/main/java/com/oss2/orderservice/dto/FormSchemaDTO.java',
    'backend/order-service/src/main/java/com/oss2/orderservice/dto/FormSubmissionDTO.java'
]

base_path = '/home/simon/ooss'

for file_path in files_to_delete:
    full_path = os.path.join(base_path, file_path)
    try:
        if os.path.exists(full_path):
            os.remove(full_path)
            print(f'✓ Deleted: {file_path}')
        else:
            print(f'⚠ File not found: {file_path}')
    except Exception as e:
        print(f'✗ Error deleting {file_path}: {e}')

print('\n✓ Cleanup complete!')
print('✓ Order-service now uses only the FeignClient from common-form-client')
