FROM jenkins/jenkins:lts-jdk17

USER root

# -------------------------
# Basic tools
# -------------------------
RUN apt-get update && apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  git \
  python3 \
  python3-pip \
  python3-venv \
  unzip \
  jq \
  && apt-get clean

# -------------------------
# Install Terraform
# -------------------------
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg && \
  echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" \
  > /etc/apt/sources.list.d/hashicorp.list && \
  apt-get update && apt-get install -y terraform

# -------------------------
# Install Ansible + Kubernetes libs (FIX FOR YOUR ERROR)
# -------------------------
RUN pip3 install --no-cache-dir \
  ansible \
  kubernetes \
  openshift \
  --break-system-packages

# -------------------------
# Install kubectl
# -------------------------
RUN curl -LO "https://dl.k8s.io/release/v1.30.0/bin/linux/amd64/kubectl" && \
  install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl && \
  rm kubectl

# -------------------------
# Install Azure CLI
# -------------------------
RUN curl -sL https://aka.ms/InstallAzureCLIDeb | bash

# -------------------------
# Install Docker CLI (for build/push images if needed)
# -------------------------
RUN mkdir -p /etc/apt/keyrings && \
  curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  > /etc/apt/sources.list.d/docker.list

RUN apt-get update && apt-get install -y docker-ce-cli && apt-get clean

# -------------------------
# Docker permission for Jenkins user
# -------------------------
RUN groupadd docker || true && \
  usermod -aG docker jenkins

# -------------------------
# Create kube directory (for AKS config if needed)
# -------------------------
RUN mkdir -p /var/jenkins_home/.kube && \
  chown -R jenkins:jenkins /var/jenkins_home/.kube

# -------------------------
# Clean up
# -------------------------
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

USER jenkins
