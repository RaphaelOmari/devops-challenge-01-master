
## `GET /drift`

### Unix curl:
   Retrieve all drifts:
   ```bash
   curl -X GET http://localhost:3000/drift -H "x-api-key: <API_KEY>" | jq
   ```

### Windows curl:
   Retrieve all drifts:
   ```bash
   curl -X GET http://localhost:3000/drift -H "x-api-key: <API_KEY>"
   ```

### Powershell:
   Retrieve all drifts:
   ```bash
    $headers = @{"x-api-key" = "<API_KEY>"}
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
     -H 'x-api-key: <API_KEY>' \
     -H 'Content-Type: application/json' \
     -d '{"name": "app_one", "version": "1.0.0", "account": "staging", "region": "primary"}'
   ```

### Windows curl
   Retrieve a list of releases with pagination:
   ```bash
   curl -X POST http://localhost:3000/release -H "x-api-key: <API_KEY>" -H "Content-Type: application/json" -d "{\"name\": \"app_one\", \"version\": \"1.0.0\", \"account\": \"staging\", \"region\": \"primary\"}"
   ```

### Powershell
   Retrieve a list of releases with pagination:
   ```bash
    $headers = @{"x-api-key" = "<API_KEY>"}
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

### Windows and Unix curl:
   Retrieve a list of releases with pagination:
   ```bash
    curl -X GET http://localhost:3000/releases -H "x-api-key: <API_KEY>"
   ```

### Powershell:
   Retrieve a list of releases:
   ```bash
    $headers = @{"x-api-key" = "<API_KEY>"}
    Invoke-RestMethod -Uri "http://localhost:3000/releases" -Method Get -Headers $headers
