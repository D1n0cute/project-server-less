# 🚀 KindNote — ENG23 3074

> เว็บแอปพลิเคชันสำหรับส่งต่อพลังบวกผ่านข้อความให้กำลังใจบนกำแพงดาว พัฒนาด้วย FastAPI และ Deploy แบบอัตโนมัติด้วยระบบ CI/CD ผ่าน Jenkins บน Kubernetes Cluster

---

## 👥 สมาชิกในกลุ่ม

| รหัสนักศึกษา | ชื่อ-นามสกุล | ความรับผิดชอบ |
|-------------|-------------|---------------|
| B6610364 | นายปัณณธร ขันละ | Git, App Development |
| B6610920 | นายธนธรณ์ เหาะดอน | Jenkins, Docker |
| B6643706 | นายชัยภัทร บุญมาสูงทรง | Terraform, Ansible |

---

## 📌 ภาพรวมโปรเจค

### แอปพลิเคชัน
- **ชื่อ:** KindNote
- **ประเภท:** Web App
- **ภาษา / Framework:** Frontend: Typescript + React, Backend: Python + FastAPI
- **คำอธิบาย:** ระบบที่เปิดให้ผู้ใช้งานสามารถพิมพ์ข้อความให้กำลังใจสั้น ๆ เพื่อนำไปแสดงผลแบบสุ่มบน "กำแพงพลังบวก" ในรูปแบบดวงดาวลอยอยู่ในอวกาศ

### Architecture Diagram
```
Developer
    │
    ▼  git push
 GitHub ──── webhook ────▶ Jenkins CI/CD
                                │
                    ┌───────────┼───────────┐
                    ▼           ▼           ▼
                 Build        Test      Docker Build
                                            │
                                            ▼
                                       Docker Hub
                                            │
                                    ┌───────┴───────┐
                                    ▼               ▼
                                Terraform        Ansible
                                    │               │
                                    └───────┬───────┘
                                            ▼
                                   Kubernetes Cluster
                                   ┌────────────────┐
                                   │  Pod 1  Pod 2  │
                                   │  [App]  [App]  │
                                   │                │
                                   │  Service (NodePort :XXXXX)  │
                                   └────────────────┘
                                            │
                              ┌─────────────┴──────────────┐
                              ▼                             ▼
                          Prometheus  ──────────────▶  Grafana
                        (scrape /metrics)            (dashboard)
```

---

## 📁 โครงสร้าง Repository

```
[project-name]/
├── ansible/
│   ├── inventory/               # รายชื่อ host เป้าหมาย
│   │   └── prod
│   ├── playbooks/               # tasks สำหรับ configure environment
│   │   ├── backend.yml
│   │   ├── frontend.yml
│   │   └── ingress.yml
│   └── ingress.yaml
├── backend/
│   └── dockerfile
├── database/
├── frontend/
│   └── dockerfile
├── Jenkinsfile/                 # กำหนด CI/CD pipeline ทุก stage
│   ├── deploy/
│   │   ├── backend/
│   │   │   └── Jenkinsfile
│   │   └── frontend/
│   │       └── Jenkinsfile
│   └── ibuild/
│       ├── backend/
│       │   └── Jenkinsfile
│       └── frontend/
│           └── Jenkinsfile
├── terraform/
│   └── main.tf                 # กำหนด resource ที่จะ provision
├── k8s/
│   ├── backend.yaml         
│   └── frontend.yaml            
├── monitoring/
│   ├── prometheus.yml          # ตั้งค่า scrape target
│   └── grafana-dashboard.json  # Dashboard ที่ export จาก Grafana
└── README.md
```

---

## ⚙️ สิ่งที่ต้องติดตั้งก่อน (Prerequisites)

ตรวจสอบให้แน่ใจว่าติดตั้งทุก tool ครบก่อนรันโปรเจค

| Tool | Version | หน้าที่ |
|------|---------|---------|
| Git | ≥ 2.x | จัดการ source code |
| Docker | ≥ 24.x | สร้างและรัน container |
| Jenkins | ≥ 2.4xx | ระบบ CI/CD automation |
| Terraform | ≥ 1.x | Provision infrastructure |
| Ansible | ≥ 2.15 | Configure environment |
| kubectl | ≥ 1.28 | สั่งงาน Kubernetes cluster |
| Prometheus | ≥ 2.x | เก็บ metrics |
| Grafana | ≥ 10.x | แสดง dashboard |

---

## 🏃 วิธีรันโปรเจค (Quick Start)

### 1. Clone Repository
```bash
git https://github.com/D1n0cute/project-server-less.git
cd project-server-less
```

### 2. รัน Local Jenkins
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --group-add 963 \
  jenkins
```

### 3. Login Azure ใน Command line
```bash
az login #เอา Credential ของ Azure เข้า Jenkins
```

### 4. Deploy Backend & Frontend ด้วย Jenkins
```
กด Deploy Pipeline ใน Jenkins
```

### 5. Sync k8s บนเครื่องเข้ากับ Cluster
```bash
az aks get-credentials \
  -g aks-rg \
  -n my-aks-cluster \
  --overwrite-existing
```

### 6. ดู IP ของ Cluster
```bash
kubectl get svc -n ingress-nginx
```

---

## 🔄 CI/CD Pipeline (Jenkins)

### ลำดับการทำงานของ Pipeline

```
Pipeline ที่ 1 (Backend-Build) : Checkout SCM ──▶ Checkout ──▶ Test Backend ──▶ Docker Build ──▶ Push Docker Hub ──▶ Cleanup
Pipeline ที่ 2 (Deploy-Backend) : Checkout SCM ──▶ Checkout ──▶ Azure Login ──▶ Terraform Apply ──▶ Get Kubeconfig ──▶ Bootstrap Ingress Controller ──▶ Wait Ingress Controller Ready ──▶ Deploy Backend ──▶ Deploy Ingress Rules
Pipeline ที่ 3 (Frontend-Build) : Checkout SCM ──▶ Checkout ──▶ Install&Test ──▶ Build Docker Image ──▶ Push To Docker Hub ──▶ Cleanup
Pipeline ที่ 4 (Frontend-Deploy) : Checkout SCM ──▶ Checkout ──▶ Azure Login ──▶ Get Kubecconfig From AKS ──▶ Deploy Frontend

```

| Stage | คำอธิบาย |
|-------|----------|
| **Checkout** | ดึงโค้ดล่าสุดจาก GitHub |
| **Build** | ติดตั้ง dependencies |
| **Test** | รัน unit test |
| **Docker Build** | สร้าง Docker image |
| **Push to Hub** | อัปโหลด image ขึ้น Docker Hub |
| **Deploy** | รัน Terraform + Ansible แล้ว apply Kubernetes manifests |

### วิธีตั้งค่า Jenkins
1. ติดตั้ง Jenkins และเปิดที่ `http://localhost:8080`
2. ติดตั้ง plugin: **Git**, **Pipeline**, **Docker Pipeline**, **Agent Docker**
3. เพิ่ม credentials สำหรับ Docker Hub 
4. เพิ่ม credentials สำหรับ Azure
5. สร้าง Pipeline job ใหม่ และชี้ไปที่ repository นี้
6. รัน ngrok เพื่อให้ได้ Playload 
7. ตั้งค่า Webhook ใน GitHub:
   - ไปที่ **Settings → Webhooks → Add webhook**
   - Payload URL: `http://[jenkins-host]:8080/github-webhook/`
   - Content type: `application/json`
   - ติ๊ก trigger: **Just the push event**

---

## 🏗️ Infrastructure as Code

### Terraform — Provision Infrastructure
```bash
cd terraform
terraform init      # ดาวน์โหลด provider plugins
terraform apply     # สร้าง resource จริง
```
> **สิ่งที่ Terraform สร้าง:** Cluster, Resource group ของ Azure

### Ansible — Configure Environment
```bash
cd ansible
ansible-playbook -i inventory playbook.yml
ansible-playbook -i inventory/prod playbooks/backend.yml
kubectl rollout restart deployment backend
ansible-playbook -i inventory/prod playbooks/ingress.yml
kubectl rollout restart deployment ingress-nginx-controller -n ingress-nginx
ansible-playbook -i inventory/prod playbooks/frontend.yml
kubectl rollout restart deployment frontend
```
> **สิ่งที่ Ansible ทำ:** Apply Backend & Frontend , Ingress Controller

> ⚠️ **หมายเหตุ:** ใน Pipeline จริง Jenkins จะเรียก Terraform และ Ansible อัตโนมัติในขั้นตอน Deploy ไม่ต้องรันด้วยมือ

---

## ☸️ Kubernetes Deployment

### Apply Manifests ด้วยตัวเอง
```bash
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

### ตรวจสอบสถานะ
```bash
kubectl get pods
kubectl get svc  
```

### ผลลัพธ์ที่ควรจะได้
```
[narukami47@archlinux project-server-less]$ kubectl get pod
NAME                        READY   STATUS    RESTARTS   AGE
backend-59dbb79c95-6kv7r    1/1     Running   0          56m
frontend-547c59bd86-dxjr9   1/1     Running   0          51m
frontend-547c59bd86-p7hbf   1/1     Running   0          51m
[narukami47@archlinux project-server-less]$ kubectl get svc
NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
backend      ClusterIP   10.0.197.109   <none>        8000/TCP   56m
frontend     ClusterIP   10.0.42.13     <none>        80/TCP     52m
kubernetes   ClusterIP   10.0.0.1       <none>        443/TCP    59m
[narukami47@archlinux project-server-less]$
10.0.197.109
```

### เข้าถึงแอปพลิเคชัน
```
http://20.239.20.37/
```
> ⚠️ **หมายเหตุ:** IP จะเปลี่ยนทุกครั้งที่สร้าง Cluster ใหม่ 


---

## 📊 Monitoring

### Prometheus — เก็บ Metrics
- ไฟล์ config: `monitoring/prometheus.yml`
- Scrape ทุก **15 วินาที**
- Target endpoint: `localhost:9090`

รัน Prometheus:
```bash
prometheus --config.file=monitoring/prometheus.yml
# เปิด UI ที่ http://localhost:9090
```

### Grafana — แสดง Dashboard
- ไฟล์ dashboard: `monitoring/grafana-dashboard.json`
- Data source: Prometheus (`http://localhost:9090`)

วิธี import dashboard:
1. เปิด Grafana ที่ `http://4.144.32.95`
2. ไปที่ **Dashboards → Import**
3. อัปโหลดไฟล์ `grafana-dashboard.json`

### Panels ใน Dashboard

| Panel | Metric (PromQL) | แสดงข้อมูลอะไร |
|-------|-----------------|----------------|
| Request Rate | `http_requests_total` | จำนวน request ต่อวินาที |
| Latency (p95) | `http_request_duration_seconds_sum / http_request_duration_seconds_count` | response time ที่ percentile 95 |
| Pod Health | `up{job="[fastapi-backend]"}` | service ขึ้นหรือล่ม (1/0) |

---

## 🌿 Branching Strategy

```
main        ──── โค้ดที่พร้อม production, protected branch
dev         ──── รวมโค้ดก่อน merge ขึ้น main
feature/*   ──── พัฒนา feature แต่ละอัน (เช่น feature/add-login)
```

| Branch | Protected | คำอธิบาย |
|--------|-----------|----------|
| `main` | ✅ | trigger pipeline อัตโนมัติเมื่อ merge |
| `dev` | ✅ | ทดสอบก่อน merge ขึ้น main |
| `feature/*` | ❌ | พัฒนาแยกกันแล้วค่อย merge เข้า dev |

---

## 🧪 API Endpoints

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| `GET` | `/` | Health check — ตรวจว่าแอปยังรันอยู่ |
| `GET` | `/metrics` | Prometheus metrics endpoint |
| `GET` | `/api/messages` | ดึงรายการข้อความให้กำลังใจทั้งหมดจากฐานข้อมูล เรียงตาม ID |
| `GET` | `/api/messages/count` | นับจำนวนข้อความทั้งหมดที่ถูกเขียนบนกำแพง |
| `POST` | `/api/messages` | บันทึกข้อความใหม่ลงฐานข้อมูล พร้อมระบุสี ตำแหน่ง และเวลาที่สร้าง |
| `DELETE` | `/api/messages/{msg_id}` | ลบข้อความที่ไม่ต้องการออกจากระบบ โดยระบุผ่าน ID |

---

## 🐛 ปัญหาที่พบบ่อย (Troubleshooting)

**Jenkins Container**
```
ทุกครั้งที่เพิ่ม Tech Stack ต้องเพิ่ม Dependencies ให้ Jenkins Container
```

**Docker Hub**
```
๋Jenkins ใส่แท็ก Image ผิด
```

---

## 📚 เอกสารอ้างอิง

- [Jenkinsfile Declarative Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)
- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Ansible Documentation](https://docs.ansible.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Markdown Syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

