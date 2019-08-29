#!/bin/bash

# Minimal Hatchet systemd install script for linux
# follows the installation process found in the wiki
# https://github.com/reed-jones/hatchet/wiki/Installation

# find the proper release and copy the link
wget https://github.com/reed-jones/hatchet/releases/download/v1.0.0-alpha/hatchet-linux

# move executable & rename
sudo mv hatchet-linux /usr/local/bin/hatchet

# mark as executable
sudo chmod +x /usr/local/bin/hatchet

# Create Systemd service
echo "[Unit]
Description=Hatchet - Cutting down your logs
Documentation=https://github.com/reed-jones/hatchet
After=network.service

[Service]
Type=simple
User=$USER
ExecStart=/usr/local/bin/hatchet
Restart=on-failure

[Install]
WantedBy=multi-user.target" | sudo tee /usr/lib/systemd/system/hatchet.service

# Start service at boot
sudo systemctl daemon-reload
sudo systemctl start hatchet
sudo systemctl enable hatchet
