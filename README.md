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


