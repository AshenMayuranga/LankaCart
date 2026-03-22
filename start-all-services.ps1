# LankaCart Microservices Startup Script
Write-Host "Starting LankaCart Microservices..." -ForegroundColor Green

# Start backend services first
Write-Host "Starting User Service (Port 8081)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; ./gradlew :user-service:bootRun"

Write-Host "Starting Product Service (Port 8082)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; ./gradlew :product-service:bootRun"

Write-Host "Starting Order Service (Port 8083)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; ./gradlew :order-service:bootRun"

Write-Host "Starting Inventory Service (Port 8084)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; ./gradlew :inventory-service:bootRun"

# Wait for services to start
Write-Host "Waiting 10 seconds for services to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Start gateway last
Write-Host "Starting API Gateway (Port 8085)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; ./gradlew :api-gateway:bootRun"

Write-Host "`nAll services are starting up..." -ForegroundColor Green
Write-Host "`nAccess URLs:" -ForegroundColor White
Write-Host "- API Gateway: http://localhost:8085" -ForegroundColor Cyan
Write-Host "- User Service: http://localhost:8081" -ForegroundColor Cyan
Write-Host "- Product Service: http://localhost:8082" -ForegroundColor Cyan
Write-Host "- Order Service: http://localhost:8083" -ForegroundColor Cyan
Write-Host "- Inventory Service: http://localhost:8084" -ForegroundColor Cyan
Write-Host "`nGateway Swagger UI: http://localhost:8085/swagger-ui.html" -ForegroundColor Magenta

# Optional: Open browser automatically
Start-Process "http://localhost:8085/swagger-ui.html"