FROM jenkins/jenkins:lts-jdk17

USER root

# ติดตั้งเฉพาะที่จำเป็น
RUN apt-get update && \
  apt-get install -y --no-install-recommends docker.io git && \
  apt-get clean && rm -rf /var/lib/apt/lists/*


USER jenkins
