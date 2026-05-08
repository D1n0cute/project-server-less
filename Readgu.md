docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --group-add 963 \
  jenkins

docker run -it mcr.microsoft.com/azure-cli

az group delete --name my-devops-rg --yes

az network bastion show --name my-bastion --resource-group my-devops-rg --query provisioningState

az aks delete \
  --name my-aks-cluster \
  --resource-group aks-rg \
  --yes \
  --no-wait

az aks get-credentials \
  -g aks-rg \
  -n my-aks-cluster \
  --overwrite-existing

kubectl apply -f <https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.1/deploy/static/provider/cloud/deploy.yaml>

kubectl get svc -n ingress-nginx
