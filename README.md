Code for reproducing the conditions of webtorrent/webtorrent#1207

To replicate the bug:

 1. Check out this repository on a local and remote server.
 2. Copy `package-working-state.json` to `package.json`.
 3. `npm install` to install `webtorrent@0.81.0`
 4. Run `./wt.js` on the remote server.
 5. Run `./wt.js` on the local server.
 6. Observe both nodes communicating:

```
$ ./wt.js 
peerId 2d5757303038312d623732633666396333353762
ready {}
torrent 8241104626199aa2b84911e238e10df9484d156c
wire X.X.X.X:42237 2d5757303038312d353534643065323537386636
t.onHandshake 8241104626199aa2b84911e238e10df9484d156c 2d5757303038312d353534643065323537386636
t.onHandshake extensions { dht: true, extended: true }
t.onExtendedHandshake { m: { sw_testext: 3, ut_metadata: 1, ut_pex: 2 },
  metadata_size: 100,
  test: <Buffer 48 65 6c 6c 6f 2c 20 57 6f 72 6c 64 21> }
Sending payload: 0.1042553525838994
t.onMessage 18:0.8657093983463904
t.onMessage 19:0.06903898600173841
Sending payload: 0.9610726478189229
t.onMessage 18:0.2457831273647444
Client is seeding: 8241104626199aa2b84911e238e10df9484d156c
Sending payload: 0.7495241725092892
t.onMessage 18:0.8740728447699799
```

 7. `ctrl-C` and delete the `node_modules` directory.
 8. Copy `package-broken-state.json` to `package.json`.
 9. `npm install` to install `webtorrent@0.98.19`.
 10. Run `./wt.js` on the remote server.
 11. Run `./wt.js` on the local server.
 12. Observe that nodes no longer communicate despite the same code:

```
$ ./wt.js 
peerId 2d5757303039382d58674354746b7a7a53416d7a
ready {}
torrent d681d6f7da8511270a04bd00e87538d13cac3745
Client is seeding: d681d6f7da8511270a04bd00e87538d13cac3745
```

