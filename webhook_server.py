#!/usr/bin/env python3
from flask import Flask, request, abort
import subprocess
import threading
import os
import hmac
import hashlib

app = Flask(__name__)

DEPLOY_SCRIPT = "/home/yatta/apps/frontend/webhook.sh"
WORKDIR = "/home/yatta/apps/frontend"
LOGFILE = os.path.join(WORKDIR, "webhook.log")

# GitHub IP aralıkları (resmi: https://api.github.com/meta)
# Production: 192.30.252.0/22, 185.199.108.0/22, 140.82.112.0/20, 143.55.64.0/20
# Actions: 192.30.252.0/22, 185.199.108.0/22, 140.82.112.0/20
GITHUB_IPS = [
    "192.30.252.0/22",
    "185.199.108.0/22",
    "140.82.112.0/20",
    "143.55.64.0/20",
]

# Webhook secret (ortam değişkeninden al, .env'de tanımla)
WEBHOOK_SECRET = os.getenv("WEBHOOK_SECRET", "")

def is_github_ip(ip):
    """IP'nin GitHub IP aralığında olup olmadığını kontrol et"""
    import ipaddress
    try:
        ip_obj = ipaddress.ip_address(ip)
        for cidr in GITHUB_IPS:
            if ip_obj in ipaddress.ip_network(cidr, strict=False):
                return True
    except:
        pass
    return False

def verify_webhook_secret(data, signature):
    """GitHub webhook secret doğrulaması"""
    if not WEBHOOK_SECRET:
        return True  # Secret tanımlı değilse atla (opsiyonel)
    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        data,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

def run_deploy_async():
    """Deploy script'i arka planda çalıştır (GitHub timeout'u için)"""
    subprocess.Popen(
        [DEPLOY_SCRIPT],
        cwd=WORKDIR,
        stdout=open(LOGFILE, "a"),
        stderr=subprocess.STDOUT,
        close_fds=True,
    )

@app.route('/webhook', methods=['POST'])
def webhook():
    # IP kontrolü (Production'da aktif)
    client_ip = request.headers.get('X-Real-IP') or request.remote_addr
    if not is_github_ip(client_ip):
        # Production'da sıkılaştırılmış IP kontrolü
        print(f"[WARN] Non-GitHub IP blocked: {client_ip}")
        abort(403)  # Production'da aktif

    # Webhook secret doğrulama (header varsa)
    signature = request.headers.get('X-Hub-Signature-256', '')
    if signature:
        if not verify_webhook_secret(request.data, signature):
            print(f"[WARN] Invalid webhook signature from {client_ip}")
            abort(403)

    # Hemen 200 dön, deploy işini arkaya at (GitHub 10sn timeout için)
    threading.Thread(target=run_deploy_async, daemon=True).start()
    return 'OK', 200

if __name__ == '__main__':
    print("Webhook server is running on port 9000...")
    app.run(host='0.0.0.0', port=9000)
