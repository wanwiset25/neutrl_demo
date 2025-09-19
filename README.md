setup instructions
1. build docker image
docker build -t validate .
2. deploy with docker-compose
docker-compose up -d


architecture
Application Logic: tx validator server backend
Proxy & rate limiter: nginx
Monitoring: grafana

call flow
external_service > nginx proxy > application 

examples: 
curl -k -X POST https://localhost:443/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "from": "user123",
    "to": "user456",
    "amount": 100.50,
    "currency": "USD",
    "description": "Payment for services"
  }'

curl -k -X POST https://localhost:443/transaction \
  -H "Content-Type: application/json" \
  -d '      {
      "transaction_id": "550e8400-e29b-41d4-a716-446655440000",
      "amount": 1000.50,
      "signatures": ["sig1", "sig2", "sig3"],
      "signers": ["alice", "bob", "charlie"]
    }'

─ curl -k https://localhost:443/health
{"status":"healthy"}% 

─ curl -k https://localhost:443/metrics
{"status":"healthy"}% 