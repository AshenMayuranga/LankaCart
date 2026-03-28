@echo off
echo Starting LankaCart Microservices...
echo.

echo Starting User Service (Port 8081)...
start "User Service" cmd /k "cd /d %~dp0 && ./gradlew :user-service:bootRun"

echo Starting Product Service (Port 8082)...
start "Product Service" cmd /k "cd /d %~dp0 && ./gradlew :product-service:bootRun"

echo Starting Order Service (Port 8083)...
start "Order Service" cmd /k "cd /d %~dp0 && ./gradlew :order-service:bootRun"

echo Starting Inventory Service (Port 8084)...
start "Inventory Service" cmd /k "cd /d %~dp0 && ./gradlew :inventory-service:bootRun"

echo Waiting 10 seconds for services to start...
timeout /t 10 /nobreak

echo Starting API Gateway (Port 8086)...
start "API Gateway" cmd /k "cd /d %~dp0 && ./gradlew :api-gateway:bootRun"

echo.
echo All services are starting up...
echo.
echo Access URLs:
echo - API Gateway: http://localhost:8086
echo - User Service: http://localhost:8081
echo - Product Service: http://localhost:8082
echo - Order Service: http://localhost:8083
echo - Inventory Service: http://localhost:8084
echo.
echo Gateway Swagger UI: http://localhost:8086/swagger-ui.html
echo.
pause
