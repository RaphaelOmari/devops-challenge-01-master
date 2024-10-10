
## `GET /drift`

### Unix curl:
   Retrieve a list of releases with pagination:
   ```bash
   curl -X GET http://localhost:3000/drift -H "x-api-key: BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q=" | jq
   ```

### Windows curl:
   Retrieve a list of releases with pagination:
   ```bash
   curl -X GET http://localhost:3000/drift -H "x-api-key: BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q="
   ```

### Powershell:
   Retrieve a list of releases with pagination:
   ```bash
    $headers = @{"x-api-key" = "BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q="}
    $response = Invoke-WebRequest -Uri "http://localhost:3000/drift" -Method Get -Headers $headers
    $parsedContent = $response.Content | ConvertFrom-Json
    $parsedContent | ConvertTo-Json -Depth 100
   ```

---

## `POST /createRelease`
### Unix curl:
   Retrieve a list of releases with pagination:
   ```bash
    curl -X POST http://localhost:3000/release \
    -H "x-api-key: BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q=" \
    -H "Content-Type: application/json" \
    -d '{"name": "app_one", "version": "1.0.0", "account": "staging", "region": "primary"}'
   ```

### Windows curl
   Retrieve a list of releases with pagination:
   ```bash
   curl -X POST http://localhost:3000/release -H "x-api-key: BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q=" -H "Content-Type: application/json" -d "{\"name\": \"app_one\", \"version\": \"1.0.0\", \"account\": \"staging\", \"region\": \"primary\"}"
   ```

### Powershell
   Retrieve a list of releases with pagination:
   ```bash
    $headers = @{"x-api-key" = "BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q="}
    $body = @{
        name = "app_one"
        version = "1.0.0"
        account = "staging"
        region = "primary"
    }
    Invoke-RestMethod -Uri "http://localhost:3000/release" -Method Post -Headers $headers -Body ($body | ConvertTo-Json) -ContentType "application/json"
   ```

---

## `GET /listReleases`

### Unix curl:
   Retrieve a list of releases with pagination:
   ```bash
    curl -X GET http://localhost:3000/releases -H "x-api-key: BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q="
   ```

### Powershell:
   Retrieve a list of releases:
   ```bash
    $headers = @{"x-api-key" = "BJDUyhRYRRZthuxfaJa+ShMWdU6MZ4P6Xu40HmK/G1Q="}
    Invoke-RestMethod -Uri "http://localhost:3000/releases" -Method Get -Headers $headers
    ```