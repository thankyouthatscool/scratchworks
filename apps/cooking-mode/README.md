Add the port forwarding instruction here.

```powershell
netsh interface portproxy add v4tov4 listenport=19000 connectport=19000 connectaddress=192.168.199.141
netsh interface portproxy add v4tov4 listenport=19001 connectport=19001 connectaddress=192.168.199.141
netsh interface portproxy add v4tov4 listenport=19002 connectport=19002 connectaddress=192.168.199.141

netsh interface portproxy delete v4tov4 listenport=19000
netsh interface portproxy delete v4tov4 listenport=19001
netsh interface portproxy delete v4tov4 listenport=19002

iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort 19000 -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort 19001 -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Inbound -LocalPort 19002 -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort 19000 -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort 19001 -Action Allow -Protocol TCP";
iex "New-NetFireWallRule -DisplayName 'WSL 2 Firewall Unlock' -Direction Outbound -LocalPort 19002 -Action Allow -Protocol TCP";
```
