#!/usr/bin/env node

var WebTorrent = require('webtorrent');

var client = new WebTorrent();

console.log("peerId", client.peerId);

var id = "test-torrent-extension-1"
var content = new Buffer(id);
content.name = id;

function random_pings(wire) {
  var payload = Math.random().toString();
  console.log("Sending payload:", payload);
  wire.extended("sw_testext", payload);
  setTimeout(function() {
    random_pings(wire);
  }, Math.random() * 5000 + 2000);
}

function make_protocol(wire, addr) {
  var t = function(wire) {
    wire.extendedHandshake.test = 'Hello, World!'
  };
  t.prototype.name = "sw_testext";
  t.prototype.onHandshake = function (infoHash, peerId, extensions) {
    console.log("t.onHandshake", infoHash, peerId);
    console.log("t.onHandshake extensions", extensions);
  }
  t.prototype.onExtendedHandshake = function (handshake) {
    console.log("t.onExtendedHandshake", handshake);
    if (handshake.m && handshake.m.sw_testext) {
      random_pings(wire);
    }
  }
  t.prototype.onMessage = function(message) {
    console.log("t.onMessage", message.toString());
  }
  return t;
}

client.on('ready', function() {
  console.log("ready", arguments);
});

client.on('torrent', function(torrent) { 
  console.log("torrent", torrent.infoHash);
});

var torrent = client.seed(content, function (torrent) {
  console.log('Client is seeding:', torrent.infoHash)
  torrent.on("infoHash", function() {
    console.log("torrent infoHash", infoHash);
  });
});

torrent.on("wire", function(wire, addr) {
  console.log("wire", addr, wire.peerId);
  wire.use(make_protocol(wire, addr));
  wire.on("handshake", function() {
    console.log("Handshake wire", arguments);
  });
});

