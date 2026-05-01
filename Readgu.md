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
