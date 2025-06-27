#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, and pipeline failures
IFS=$'\n\t'       # Stricter word splitting

# Flush existing rules and delete existing ipsets
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X
iptables -t mangle -F
iptables -t mangle -X
ipset destroy allowed-domains 2>/dev/null || true

# Set default policies to ACCEPT to allow all traffic
iptables -P INPUT ACCEPT
iptables -P FORWARD ACCEPT
iptables -P OUTPUT ACCEPT

echo "Firewall configuration set to allow all traffic."
echo "Verifying firewall rules..."
if curl --connect-timeout 5 https://example.com >/dev/null 2>&1; then
    echo "Firewall verification passed - able to reach https://example.com as expected"
else
    echo "ERROR: Firewall verification failed - was unable to reach https://example.com"
    exit 1
fi

# Verify GitHub API access
if curl --connect-timeout 5 https://api.github.com/zen >/dev/null 2>&1; then
    echo "Firewall verification passed - able to reach https://api.github.com as expected"
else
    echo "ERROR: Firewall verification failed - unable to reach https://api.github.com"
    exit 1
fi
