// // new MicTest({reportSuccess: console.log, reportInfo: console.log, reportMessage: console.log, reportFatal: console.log, reportFailure: console.log, done: () => console.log('done')})
// // new CamResolutionsTest({reportSuccess: console.log, reportInfo: console.log, reportMessage: console.log, reportFatal: console.log, reportFailure: console.log, done: () => console.log('done')}, [[640, 480]])
function setTimeoutWithProgressBar(e, t) {
  var i = window.performance.now()
      , n = setInterval(function() {
  }, 100)
      , r = function() {
      clearInterval(n),
          e()
  }
      , o = setTimeout(r, t);
  return function() {
      clearTimeout(o),
          r()
  }
}

class MicTest {

  constructor(success, info, error) {
      this.inputChannelCount = 6,
          this.outputChannelCount = 2,
          this.bufferSize = 0,
          this.constraints = {
              audio: {
                  optional: [{
                      echoCancellation: !1
                  }]
              }
          },
          this.collectSeconds = 2,
          this.silentThreshold = 1 / 32767,
          this.lowVolumeThreshold = -60,
          this.monoDetectThreshold = 1 / 65536,
          this.clipCountThreshold = 6,
          this.clipThreshold = 1,
          this.collectedAudio = [],
          this.collectedSampleCount = 0;
      for (var t = 0; t < this.inputChannelCount; ++t)
          this.collectedAudio[t] = []

      this.success = success;
      this.info = info;
      this.error = (msg) => {
          error(msg);
          this.success = () => null;
          this.error = () => null;
          this.info = () => null;
      };
  }

  doGetUserMedia(e, t, i) {
      navigator.mediaDevices.getUserMedia(e).then(function(e) {
          t.apply(this, arguments)
      }).catch(e => this.error(e))
  }

  run() {
      try {
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          window.audioContext = new AudioContext
      } catch (e) {
          console.log("Failed to instantiate an audio context, error: " + e)
      }

      if (void 0 === audioContext) {
          this.error("WebAudio is not supported, test cannot run.");
      } else {
          this.doGetUserMedia(this.constraints, this.gotStream.bind(this))
      }
  }

  gotStream(e) {
      this.checkAudioTracks(e) ? this.createAudioBuffer(e) : null;
  }

  checkAudioTracks(e) {
      this.stream = e;
      var t = e.getAudioTracks();
      return t.length < 1 ? (this.error("No audio track in returned stream."),
          !1) : (this.info("Audio track created using device=" + t[0].label),
          !0)
  }

  createAudioBuffer() {
      this.audioSource = audioContext.createMediaStreamSource(this.stream),
          this.scriptNode = audioContext.createScriptProcessor(this.bufferSize, this.inputChannelCount, this.outputChannelCount),
          this.audioSource.connect(this.scriptNode),
          this.scriptNode.connect(audioContext.destination),
          this.scriptNode.onaudioprocess = this.collectAudio.bind(this),
          this.stopCollectingAudio = setTimeoutWithProgressBar(this.onStopCollectingAudio.bind(this), 5e3)
  }

  collectAudio(e) {
      for (var t = e.inputBuffer.length, i = !0, n = 0; n < e.inputBuffer.numberOfChannels; n++) {
          var r, o = e.inputBuffer.getChannelData(n), s = Math.abs(o[0]), a = Math.abs(o[t - 1]);
          s > this.silentThreshold || a > this.silentThreshold ? ((r = new Float32Array(t)).set(o),
              i = !1) : r = new Float32Array,
              this.collectedAudio[n].push(r)
      }
      i || (this.collectedSampleCount += t,
      this.collectedSampleCount / e.inputBuffer.sampleRate >= this.collectSeconds && this.stopCollectingAudio())
  }

  onStopCollectingAudio() {
      this.stream.getAudioTracks()[0].stop(),
          this.audioSource.disconnect(this.scriptNode),
          this.scriptNode.disconnect(audioContext.destination),
          this.analyzeAudio(this.collectedAudio),
          this.success()
  }

  analyzeAudio(e) {
      for (var t = [], i = 0; i < e.length; i++)
          this.channelStats(i, e[i]) && t.push(i);
      0 === t.length ? this.error("No active input channels detected. Microphone is most likely muted or broken, please check if muted in the sound settings or physically on the device. Then rerun the test.") : this.info("Active audio input channels: " + t.length),
      2 === t.length && this.detectMono(e[t[0]], e[t[1]])
  }

  channelStats(e, t) {
      for (var i = 0, n = 0, r = 0, o = 0, s = 0; s < t.length; s++) {
          var a = t[s];
          if (a.length > 0) {
              for (var c = 0, l = 0, d = 0; d < a.length; d++)
                  l += (c = Math.abs(a[d])) * c,
                      (i = Math.max(i, c)) >= this.clipThreshold ? (r++,
                          o = Math.max(o, r)) : r = 0;
              l = Math.sqrt(l / a.length),
                  n = Math.max(n, l)
          }
      }
      if (i > this.silentThreshold) {
          var h = this.dBFS(i)
              , u = this.dBFS(n);
          return this.info("Channel " + e + " levels: " + h.toFixed(1) + " dB (peak), " + u.toFixed(1) + " dB (RMS)"),
          u < this.lowVolumeThreshold && this.error("Microphone input level is low, increase input volume or move closer to the microphone."),
          o > this.clipCountThreshold && this.error("Clipping detected! Microphone input level is high. Decrease input volume or move away from the microphone."),
              !0
      }
      return !1
  }

  detectMono(e, t) {
      for (var i = 0, n = 0; n < e.length; n++) {
          var r = e[n]
              , o = t[n];
          if (r.length === o.length)
              for (var s = 0; s < r.length; s++)
                  Math.abs(r[s] - o[s]) > this.monoDetectThreshold && i++;
          else
              i++
      }
      i > 0 ? this.info("Stereo microphone detected.") : this.info("Mono microphone detected.")
  }

  dBFS(e) {
      var t = 20 * Math.log(e) / Math.log(10);
      return Math.round(10 * t) / 10
  }

}

function enumerateStats(e, t, i) {
  var n = {
      audio: {
          local: {
              audioLevel: 0,
              bytesSent: 0,
              clockRate: 0,
              codecId: "",
              mimeType: "",
              packetsSent: 0,
              payloadType: 0,
              timestamp: 0,
              trackId: "",
              transportId: ""
          },
          remote: {
              audioLevel: 0,
              bytesReceived: 0,
              clockRate: 0,
              codecId: "",
              fractionLost: 0,
              jitter: 0,
              mimeType: "",
              packetsLost: -1,
              packetsReceived: 0,
              payloadType: 0,
              timestamp: 0,
              trackId: "",
              transportId: ""
          }
      },
      video: {
          local: {
              bytesSent: 0,
              clockRate: 0,
              codecId: "",
              firCount: 0,
              framesEncoded: 0,
              frameHeight: 0,
              framesSent: -1,
              frameWidth: 0,
              nackCount: 0,
              packetsSent: -1,
              payloadType: 0,
              pliCount: 0,
              qpSum: 0,
              timestamp: 0,
              trackId: "",
              transportId: ""
          },
          remote: {
              bytesReceived: -1,
              clockRate: 0,
              codecId: "",
              firCount: -1,
              fractionLost: 0,
              frameHeight: 0,
              framesDecoded: 0,
              framesDropped: 0,
              framesReceived: 0,
              frameWidth: 0,
              nackCount: -1,
              packetsLost: -1,
              packetsReceived: 0,
              payloadType: 0,
              pliCount: -1,
              qpSum: 0,
              timestamp: 0,
              trackId: "",
              transportId: ""
          }
      },
      connection: {
          availableOutgoingBitrate: 0,
          bytesReceived: 0,
          bytesSent: 0,
          consentRequestsSent: 0,
          currentRoundTripTime: 0,
          localCandidateId: "",
          localCandidateType: "",
          localIp: "",
          localPort: 0,
          localPriority: 0,
          localProtocol: "",
          remoteCandidateId: "",
          remoteCandidateType: "",
          remoteIp: "",
          remotePort: 0,
          remotePriority: 0,
          remoteProtocol: "",
          requestsReceived: 0,
          requestsSent: 0,
          responsesReceived: 0,
          responsesSent: 0,
          timestamp: 0,
          totalRoundTripTime: 0
      }
  };
  return e && (e.forEach(function(e, r) {
      switch (e.type) {
          case "outbound-rtp":
              e.hasOwnProperty("trackId") && (1 !== e.trackId.indexOf(t.audio) & "" !== t.audio ? (n.audio.local.bytesSent = e.bytesSent,
                  n.audio.local.codecId = e.codecId,
                  n.audio.local.packetsSent = e.packetsSent,
                  n.audio.local.timestamp = e.timestamp,
                  n.audio.local.trackId = e.trackId,
                  n.audio.local.transportId = e.transportId) : 1 !== e.trackId.indexOf(t.video) & "" !== t.video && (n.video.local.bytesSent = e.bytesSent,
                  n.video.local.codecId = e.codecId,
                  n.video.local.firCount = e.firCount,
                  n.video.local.framesEncoded = e.framesEncoded,
                  n.video.local.framesSent = e.framesSent,
                  n.video.local.packetsSent = e.packetsSent,
                  n.video.local.pliCount = e.pliCount,
                  n.video.local.qpSum = e.qpSum,
                  n.video.local.timestamp = e.timestamp,
                  n.video.local.trackId = e.trackId,
                  n.video.local.transportId = e.transportId));
              break;
          case "inbound-rtp":
              e.hasOwnProperty("trackId") && (1 !== e.trackId.indexOf(i.audio) & "" !== i.audio && (n.audio.remote.bytesReceived = e.bytesReceived,
                  n.audio.remote.codecId = e.codecId,
                  n.audio.remote.fractionLost = e.fractionLost,
                  n.audio.remote.jitter = e.jitter,
                  n.audio.remote.packetsLost = e.packetsLost,
                  n.audio.remote.packetsReceived = e.packetsReceived,
                  n.audio.remote.timestamp = e.timestamp,
                  n.audio.remote.trackId = e.trackId,
                  n.audio.remote.transportId = e.transportId),
              1 !== e.trackId.indexOf(i.video) & "" !== i.video && (n.video.remote.bytesReceived = e.bytesReceived,
                  n.video.remote.codecId = e.codecId,
                  n.video.remote.firCount = e.firCount,
                  n.video.remote.fractionLost = e.fractionLost,
                  n.video.remote.nackCount = e.nackCount,
                  n.video.remote.packetsLost = e.packetsLost,
                  n.video.remote.packetsReceived = e.packetsReceived,
                  n.video.remote.pliCount = e.pliCount,
                  n.video.remote.qpSum = e.qpSum,
                  n.video.remote.timestamp = e.timestamp,
                  n.video.remote.trackId = e.trackId,
                  n.video.remote.transportId = e.transportId));
              break;
          case "candidate-pair":
              e.hasOwnProperty("availableOutgoingBitrate") && (n.connection.availableOutgoingBitrate = e.availableOutgoingBitrate,
                  n.connection.bytesReceived = e.bytesReceived,
                  n.connection.bytesSent = e.bytesSent,
                  n.connection.consentRequestsSent = e.consentRequestsSent,
                  n.connection.currentRoundTripTime = e.currentRoundTripTime,
                  n.connection.localCandidateId = e.localCandidateId,
                  n.connection.remoteCandidateId = e.remoteCandidateId,
                  n.connection.requestsReceived = e.requestsReceived,
                  n.connection.requestsSent = e.requestsSent,
                  n.connection.responsesReceived = e.responsesReceived,
                  n.connection.responsesSent = e.responsesSent,
                  n.connection.timestamp = e.timestamp,
                  n.connection.totalRoundTripTime = e.totalRoundTripTime);
              break;
          default:
              return
      }
  }
      .bind()),
      e.forEach(function(e) {
          switch (e.type) {
              case "track":
                  e.hasOwnProperty("trackIdentifier") && (1 !== e.trackIdentifier.indexOf(t.video) & "" !== t.video && (n.video.local.frameHeight = e.frameHeight,
                      n.video.local.framesSent = e.framesSent,
                      n.video.local.frameWidth = e.frameWidth),
                  1 !== e.trackIdentifier.indexOf(i.video) & "" !== i.video && (n.video.remote.frameHeight = e.frameHeight,
                      n.video.remote.framesDecoded = e.framesDecoded,
                      n.video.remote.framesDropped = e.framesDropped,
                      n.video.remote.framesReceived = e.framesReceived,
                      n.video.remote.frameWidth = e.frameWidth),
                  1 !== e.trackIdentifier.indexOf(t.audio) & "" !== t.audio && (n.audio.local.audioLevel = e.audioLevel),
                  1 !== e.trackIdentifier.indexOf(i.audio) & "" !== i.audio && (n.audio.remote.audioLevel = e.audioLevel));
                  break;
              case "codec":
                  e.hasOwnProperty("id") && (1 !== e.id.indexOf(n.audio.local.codecId) & "" !== t.audio && (n.audio.local.clockRate = e.clockRate,
                      n.audio.local.mimeType = e.mimeType,
                      n.audio.local.payloadType = e.payloadType),
                  1 !== e.id.indexOf(n.audio.remote.codecId) & "" !== i.audio && (n.audio.remote.clockRate = e.clockRate,
                      n.audio.remote.mimeType = e.mimeType,
                      n.audio.remote.payloadType = e.payloadType),
                  1 !== e.id.indexOf(n.video.local.codecId) & "" !== t.video && (n.video.local.clockRate = e.clockRate,
                      n.video.local.mimeType = e.mimeType,
                      n.video.local.payloadType = e.payloadType),
                  1 !== e.id.indexOf(n.video.remote.codecId) & "" !== i.video && (n.video.remote.clockRate = e.clockRate,
                      n.video.remote.mimeType = e.mimeType,
                      n.video.remote.payloadType = e.payloadType));
                  break;
              case "local-candidate":
                  e.hasOwnProperty("id") && -1 !== e.id.indexOf(n.connection.localCandidateId) && (n.connection.localIp = e.ip,
                      n.connection.localPort = e.port,
                      n.connection.localPriority = e.priority,
                      n.connection.localProtocol = e.protocol,
                      n.connection.localType = e.candidateType);
                  break;
              case "remote-candidate":
                  e.hasOwnProperty("id") && -1 !== e.id.indexOf(n.connection.remoteCandidateId) && (n.connection.remoteIp = e.ip,
                      n.connection.remotePort = e.port,
                      n.connection.remotePriority = e.priority,
                      n.connection.remoteProtocol = e.protocol,
                      n.connection.remoteType = e.candidateType);
                  break;
              default:
                  return
          }
      }
          .bind())),
      n
}

function arrayAverage(e) {
  for (var t = e.length, i = 0, n = 0; n < t; n++)
      i += e[n];
  return Math.floor(i / t)
}
function arrayMax(e) {
  return 0 === e.length ? NaN : Math.max.apply(Math, e)
}
function arrayMin(e) {
  return 0 === e.length ? NaN : Math.min.apply(Math, e)
}

function Report() {
  this.output_ = [],
      this.nextAsyncId_ = 0,
      this.nativeLog_ = console.log.bind(console),
      window.addEventListener("error", this.onWindowError_.bind(this)),
      this.traceEventInstant("system-info", Report.getSystemInfo())
}

Report.prototype = {
  traceEventInstant: function(e, t) {
      this.output_.push({
          ts: Date.now(),
          name: e,
          args: t
      })
  },
  traceEventWithId: function(e, t, i) {
      this.output_.push({
          ts: Date.now(),
          name: e,
          id: t,
          args: i
      })
  },
  traceEventAsync: function(e) {
      return this.traceEventWithId.bind(this, e, this.nextAsyncId_++)
  },
  logTestRunResult: function(e, t) {
      ga("send", {
          hitType: "event",
          eventCategory: "Test",
          eventAction: t,
          eventLabel: e,
          nonInteraction: 1
      })
  },
  generate: function(e) {
      var t = {
          title: "WebRTC Troubleshooter bug report",
          description: e || null
      };
      return this.getContent_(t)
  },
  getContent_: function(e) {
      var t = [];
      return this.appendEventsAsString_([e] || [], t),
          this.appendEventsAsString_(this.output_, t),
      "[" + t.join(",\n") + "]"
  },
  appendEventsAsString_: function(e, t) {
      for (var i = 0; i !== e.length; ++i)
          t.push(JSON.stringify(e[i]))
  },
  onWindowError_: function(e) {
      this.traceEventInstant("error", {
          message: e.message,
          filename: e.filename + ":" + e.lineno
      })
  },
  logHook_: function() {
      this.traceEventInstant("log", arguments),
          this.nativeLog_.apply(null, arguments)
  }
}

Report.getSystemInfo = function() {
  var e, t, i, n = navigator.userAgent, r = navigator.appName, o = "" + parseFloat(navigator.appVersion);
  return -1 !== (t = n.indexOf("Chrome")) ? (r = "Chrome",
      o = n.substring(t + 7)) : -1 !== (t = n.indexOf("MSIE")) ? (r = "Microsoft Internet Explorer",
      o = n.substring(t + 5)) : -1 !== (t = n.indexOf("Trident")) ? (r = "Microsoft Internet Explorer",
      o = n.substring(t + 8)) : -1 !== (t = n.indexOf("Firefox")) ? r = "Firefox" : -1 !== (t = n.indexOf("Safari")) ? (r = "Safari",
      o = n.substring(t + 7),
  -1 !== (t = n.indexOf("Version")) && (o = n.substring(t + 8))) : (e = n.lastIndexOf(" ") + 1) < (t = n.lastIndexOf("/")) && (r = n.substring(e, t),
      o = n.substring(t + 1),
  r.toLowerCase() === r.toUpperCase() && (r = navigator.appName)),
  -1 !== (i = o.indexOf(";")) && (o = o.substring(0, i)),
  -1 !== (i = o.indexOf(" ")) && (o = o.substring(0, i)),
      {
          browserName: r,
          browserVersion: o,
          platform: navigator.platform
      }
}

const report = new Report;

function Call(e, t) {
  this.test = t,
      this.traceEvent = report.traceEventAsync("call"),
      this.traceEvent({
          config: e
      }),
      this.statsGatheringRunning = !1,
      this.pc1 = new RTCPeerConnection(e),
      this.pc2 = new RTCPeerConnection(e),
      this.pc1.addEventListener("icecandidate", this.onIceCandidate_.bind(this, this.pc2)),
      this.pc2.addEventListener("icecandidate", this.onIceCandidate_.bind(this, this.pc1)),
      this.iceCandidateFilter_ = Call.noFilter
}

Call.prototype = {
  establishConnection: function() {
      this.traceEvent({
          state: "start"
      }),
          this.pc1.createOffer().then(this.gotOffer_.bind(this), () => console.error('reportFatal'))
  },
  close: function() {
      this.traceEvent({
          state: "end"
      }),
          this.pc1.close(),
          this.pc2.close()
  },
  setIceCandidateFilter: function(e) {
      this.iceCandidateFilter_ = e
  },
  constrainVideoBitrate: function(e) {
      this.constrainVideoBitrateKbps_ = e
  },
  disableVideoFec: function() {
      this.constrainOfferToRemoveVideoFec_ = !0
  },
  gatherStats: function(e, t, i, n) {
      function r() {
          if ("closed" === e.signalingState)
              return h.statsGatheringRunning = !1,
                  void n(a, l, c, d);
          e.getStats().then(s).catch(function(e) {
              h.test.reportError("Could not gather stats: " + e),
                  h.statsGatheringRunning = !1,
                  n(a, l)
          }
              .bind(h)),
          t && t.getStats().then(o)
      }
      function o(e) {
          if ("chrome" === adapter.browserDetails.browser) {
              var t = enumerateStats(e, h.localTrackIds, h.remoteTrackIds);
              c.push(t),
                  d.push(Date.now())
          } else if ("firefox" === adapter.browserDetails.browser)
              for (var i in e) {
                  var n = e[i];
                  c.push(n),
                      d.push(Date.now())
              }
          else
              h.test.reportError("Only Firefox and Chrome getStats implementations are supported.")
      }
      function s(e) {
          if ("chrome" === adapter.browserDetails.browser) {
              var t = enumerateStats(e, h.localTrackIds, h.remoteTrackIds);
              a.push(t),
                  l.push(Date.now())
          } else if ("firefox" === adapter.browserDetails.browser)
              for (var i in e) {
                  var n = e[i];
                  a.push(n),
                      l.push(Date.now())
              }
          else
              h.test.reportError("Only Firefox and Chrome getStats implementations are supported.");
          setTimeout(r, u)
      }
      var a = []
          , c = []
          , l = []
          , d = []
          , h = this
          , u = 100;
      h.localTrackIds = {
          audio: "",
          video: ""
      },
          h.remoteTrackIds = {
              audio: "",
              video: ""
          },
          e.getSenders().forEach(function(e) {
              "audio" === e.track.kind ? h.localTrackIds.audio = e.track.id : "video" === e.track.kind && (h.localTrackIds.video = e.track.id)
          }
              .bind(h)),
      t && t.getReceivers().forEach(function(e) {
          "audio" === e.track.kind ? h.remoteTrackIds.audio = e.track.id : "video" === e.track.kind && (h.remoteTrackIds.video = e.track.id)
      }
          .bind(h)),
          this.statsGatheringRunning = !0,
          r()
  },
  gotOffer_: function(e) {
      this.constrainOfferToRemoveVideoFec_ && (e.sdp = e.sdp.replace(/(m=video 1 [^\r]+)(116 117)(\r\n)/g, "$1\r\n"),
          e.sdp = e.sdp.replace(/a=rtpmap:116 red\/90000\r\n/g, ""),
          e.sdp = e.sdp.replace(/a=rtpmap:117 ulpfec\/90000\r\n/g, ""),
          e.sdp = e.sdp.replace(/a=rtpmap:98 rtx\/90000\r\n/g, ""),
          e.sdp = e.sdp.replace(/a=fmtp:98 apt=116\r\n/g, "")),
          this.pc1.setLocalDescription(e),
          this.pc2.setRemoteDescription(e),
          this.pc2.createAnswer().then(this.gotAnswer_.bind(this), () => console.error('reportFatal'))
  },
  gotAnswer_: function(e) {
      this.constrainVideoBitrateKbps_ && (e.sdp = e.sdp.replace(/a=mid:video\r\n/g, "a=mid:video\r\nb=AS:" + this.constrainVideoBitrateKbps_ + "\r\n")),
          this.pc2.setLocalDescription(e),
          this.pc1.setRemoteDescription(e)
  },
  onIceCandidate_: function(e, t) {
      if (t.candidate) {
          var i = Call.parseCandidate(t.candidate.candidate);
          this.iceCandidateFilter_(i) && e.addIceCandidate(t.candidate)
      }
  }
},
  Call.noFilter = function() {
      return !0
  }
  ,
  Call.isRelay = function(e) {
      return "relay" === e.type
  }
  ,
  Call.isNotHostCandidate = function(e) {
      return "host" !== e.type
  }
  ,
  Call.isReflexive = function(e) {
      return "srflx" === e.type
  }
  ,
  Call.isHost = function(e) {
      return "host" === e.type
  }
  ,
  Call.isIpv6 = function(e) {
      return -1 !== e.address.indexOf(":")
  }
  ,
  Call.parseCandidate = function(e) {
      var t = e.indexOf("candidate:") + "candidate:".length
          , i = e.substr(t).split(" ");
      return {
          type: i[7],
          protocol: i[2],
          address: i[4]
      }
  }
  ,
  Call.cachedIceServers_ = null,
  Call.cachedIceConfigFetchTime_ = null,
  Call.asyncCreateTurnConfig = function(e, t) {
      var i = currentTest.settings;
      if ("string" == typeof i.turnURI && "" !== i.turnURI) {
          var n = {
              iceServers: [{
                  username: i.turnUsername || "",
                  credential: i.turnCredential || "",
                  urls: i.turnURI.split(",")
              }]
          };
          report.traceEventInstant("turn-config", n),
              setTimeout(e.bind(null, n), 0)
      } else
          Call.fetchTurnConfig_(function(t) {
              var i = {
                  iceServers: t.iceServers
              };
              report.traceEventInstant("turn-config", i),
                  e(i)
          }, t)
  }
  ,
  Call.asyncCreateStunConfig = function(e, t) {
      var i = currentTest.settings;
      if ("string" == typeof i.stunURI && "" !== i.stunURI) {
          var n = {
              iceServers: [{
                  urls: i.stunURI.split(",")
              }]
          };
          report.traceEventInstant("stun-config", n),
              setTimeout(e.bind(null, n), 0)
      } else
          Call.fetchTurnConfig_(function(t) {
              var i = {
                  iceServers: t.iceServers.urls
              };
              report.traceEventInstant("stun-config", i),
                  e(i)
          }, t)
  }
  ,
  Call.fetchTurnConfig_ = function(e, t) {
      if (Call.cachedIceServers_) {
          if (!((Date.now() - Call.cachedIceConfigFetchTime_) / 1e3 > parseInt(Call.cachedIceServers_.lifetimeDuration) - 240))
              return report.traceEventInstant("fetch-ice-config", "Using cached credentials."),
                  void e(Call.getCachedIceCredentials_())
      }
      var i = new XMLHttpRequest;
      i.onreadystatechange = function() {
          if (4 === i.readyState)
              if (200 === i.status) {
                  var n = JSON.parse(i.responseText);
                  Call.cachedIceServers_ = n,
                      Call.getCachedIceCredentials_ = function() {
                          return JSON.parse(JSON.stringify(Call.cachedIceServers_))
                      }
                      ,
                      Call.cachedIceConfigFetchTime_ = Date.now(),
                      report.traceEventInstant("fetch-ice-config", "Fetching new credentials."),
                      e(Call.getCachedIceCredentials_())
              } else
                  t("TURN request failed")
      }
          ,
          i.open("POST", "https://networktraversal.googleapis.com/v1alpha/iceconfig?key=AIzaSyDX4ctY_VWUm7lDdO6i_-bx7J-CDkxS16I", !0),
          i.send()
  }

function Ssim() {}

Ssim.prototype = {
  statistics: function(e) {
      var t, i = 0;
      for (t = 0; t < e.length; ++t)
          i += e[t];
      var n = i / (e.length - 1)
          , r = 0;
      for (t = 1; t < e.length; ++t)
          r = e[t - 1] - n,
              i += e[t] + r * r;
      return {
          mean: n,
          variance: i / e.length
      }
  },
  covariance: function(e, t, i, n) {
      for (var r = 0, o = 0; o < e.length; o += 1)
          r += (e[o] - i) * (t[o] - n);
      return r / e.length
  },
  calculate: function(e, t) {
      if (e.length !== t.length)
          return 0;
      var i = .03 * 255 * (.03 * 255)
          , n = i / 2
          , r = this.statistics(e)
          , o = r.mean
          , s = r.variance
          , a = Math.sqrt(s)
          , c = this.statistics(t)
          , l = c.mean
          , d = c.variance
          , h = Math.sqrt(d);
      return (2 * o * l + 6.502500000000001) / (o * o + l * l + 6.502500000000001) * ((2 * a * h + i) / (s + d + i)) * ((this.covariance(e, t, o, l) + n) / (a * h + n))
  }
}

function VideoFrameChecker(e) {
  this.frameStats = {
      numFrozenFrames: 0,
      numBlackFrames: 0,
      numFrames: 0
  },
      this.running_ = !0,
      this.nonBlackPixelLumaThreshold = 20,
      this.previousFrame_ = [],
      this.identicalFrameSsimThreshold = .985,
      this.frameComparator = new Ssim,
      this.canvas_ = document.createElement("canvas"),
      this.videoElement_ = e,
      this.listener_ = this.checkVideoFrame_.bind(this),
      this.videoElement_.addEventListener("play", this.listener_, !1)
}

VideoFrameChecker.prototype = {
  stop: function() {
      this.videoElement_.removeEventListener("play", this.listener_),
          this.running_ = !1
  },
  getCurrentImageData_: function() {
      this.canvas_.width = this.videoElement_.width,
          this.canvas_.height = this.videoElement_.height;
      var e = this.canvas_.getContext("2d");
      return e.drawImage(this.videoElement_, 0, 0, this.canvas_.width, this.canvas_.height),
          e.getImageData(0, 0, this.canvas_.width, this.canvas_.height)
  },
  checkVideoFrame_: function() {
      if (this.running_ && !this.videoElement_.ended) {
          var e = this.getCurrentImageData_();
          this.isBlackFrame_(e.data, e.data.length) && this.frameStats.numBlackFrames++,
          this.frameComparator.calculate(this.previousFrame_, e.data) > this.identicalFrameSsimThreshold && this.frameStats.numFrozenFrames++,
              this.previousFrame_ = e.data,
              this.frameStats.numFrames++,
              setTimeout(this.checkVideoFrame_.bind(this), 20)
      }
  },
  isBlackFrame_: function(e, t) {
      for (var i = this.nonBlackPixelLumaThreshold, n = 0, r = 4; r < t; r += 4)
          if ((n += .21 * e[r] + .72 * e[r + 1] + .07 * e[r + 2]) > i * r / 4)
              return !1;
      return !0
  }
}

class CamResolutionsTest {

  constructor(resolution,success, info, error) {
      this.resolutions = resolution,
          this.currentResolution = 0,
          this.isMuted = !1,
          this.isShuttingDown = !1
      this.success = success;
      this.info = info;
      this.error = (msg) => {
          error(msg);
          this.success = () => null;
          this.error = () => null;
          this.info = () => null;
      };
  }

  run() {
      this.startGetUserMedia(this.resolutions[this.currentResolution])
  }

  startGetUserMedia(e) {
      var t = {
          audio: !1,
          video: {
              width: {
                  exact: e[0]
              },
              height: {
                  exact: e[1]
              }
          }
      };
      console.log(t);
      navigator.mediaDevices.getUserMedia(t).then(function(t) {
          console.log(this),
              this.resolutions.length > 1 ? (this.info("Supported: " + e[0] + "x" + e[1]),
                  t.getTracks().forEach(function(e) {
                      e.stop()
                  }),
                  this.maybeContinueGetUserMedia()) : this.collectAndAnalyzeStats_(t, e)
      }
          .bind(this)).catch(function(t) {
          console.log(t),
              this.resolutions.length > 1 ? this.error(e[0] + "x" + e[1] + " not supported") : this.error("getUserMedia failed with error: " + t.name),
              this.maybeContinueGetUserMedia()
      }
          .bind(this))
  }

  maybeContinueGetUserMedia() {
      this.currentResolution !== this.resolutions.length ? this.startGetUserMedia(this.resolutions[this.currentResolution++]) : null
  }

  collectAndAnalyzeStats_(e, t) {
      var i = e.getVideoTracks();
      if (i.length < 1)
          return this.error("No video track in returned stream."),
              void this.maybeContinueGetUserMedia();
      var n = i[0];
      "function" == typeof n.addEventListener && (n.addEventListener("ended", function() {
          this.isShuttingDown || this.error("Video track ended, camera stopped working")
      }
          .bind(this)),
          n.addEventListener("mute", function() {
              this.isShuttingDown || (this.info("Your camera reported itself as muted."),
                  this.isMuted = !0)
          }
              .bind(this)),
          n.addEventListener("unmute", function() {
              this.isShuttingDown || (this.info("Your camera reported itself as unmuted."),
                  this.isMuted = !1)
          }
              .bind(this)));
      var r = document.createElement("video");
      r.setAttribute("autoplay", ""),
          r.setAttribute("muted", ""),
          r.width = t[0],
          r.height = t[1],
          r.srcObject = e;
      var o = new VideoFrameChecker(r)
          , s = new Call(null,this.test);
      s.pc1.addStream(e),
          s.establishConnection(),
          s.gatherStats(s.pc1, null, e, this.onCallEnded_.bind(this, t, r, e, o), 100),
          setTimeoutWithProgressBar(this.endCall_.bind(this, s, e), 8e3)
  }

  onCallEnded_(e, t, i, n, r, o) {
      this.analyzeStats_(e, t, i, n, r, o),
          n.stop(),
          null
  }

  analyzeStats_(e, t, i, n, r, o) {
      var s = []
          , a = []
          , c = []
          , l = {}
          , d = n.frameStats;
      for (var h in r)
          "ssrc" === r[h].type && parseInt(r[h].googFrameRateInput) > 0 && (s.push(parseInt(r[h].googAvgEncodeMs)),
              a.push(parseInt(r[h].googFrameRateInput)),
              c.push(parseInt(r[h].googFrameRateSent)));
      l.cameraName = i.getVideoTracks()[0].label || NaN,
          l.actualVideoWidth = t.videoWidth,
          l.actualVideoHeight = t.videoHeight,
          l.mandatoryWidth = e[0],
          l.mandatoryHeight = e[1],
          l.encodeSetupTimeMs = this.extractEncoderSetupTime_(r, o),
          l.avgEncodeTimeMs = arrayAverage(s),
          l.minEncodeTimeMs = arrayMin(s),
          l.maxEncodeTimeMs = arrayMax(s),
          l.avgInputFps = arrayAverage(a),
          l.minInputFps = arrayMin(a),
          l.maxInputFps = arrayMax(a),
          l.avgSentFps = arrayAverage(c),
          l.minSentFps = arrayMin(c),
          l.maxSentFps = arrayMax(c),
          l.isMuted = this.isMuted,
          l.testedFrames = d.numFrames,
          l.blackFrames = d.numBlackFrames,
          l.frozenFrames = d.numFrozenFrames,
          report.traceEventInstant("video-stats", l),
          this.testExpectations_(l),
          this.success();
  }

  endCall_(e, t) {
      this.isShuttingDown = !0,
          t.getTracks().forEach(function(e) {
              e.stop()
          }),
          e.close()
  }

  extractEncoderSetupTime_(e, t) {
      for (var i = 0; i !== e.length; i++)
          if ("ssrc" === e[i].type && parseInt(e[i].googFrameRateInput) > 0)
              return JSON.stringify(t[i] - t[0]);
      return NaN
  }

  resolutionMatchesIndependentOfRotationOrCrop_(e, t, i, n) {
      var r = Math.min(i, n);
      return e === i && t === n || e === n && t === i || e === r && n === r
  }

  testExpectations_(e) {
      var t = [];
      for (var i in e)
          e.hasOwnProperty(i) && ("number" == typeof e[i] && isNaN(e[i]) ? t.push(i) : this.info(i + ": " + e[i]));
      0 !== t.length && this.info("Not available: " + t.join(", ")),
          isNaN(e.avgSentFps) ? this.info("Cannot verify sent FPS.") : e.avgSentFps < 5 ? this.error("Low average sent FPS: " + e.avgSentFps) : this.info("Average FPS above threshold"),
          this.resolutionMatchesIndependentOfRotationOrCrop_(e.actualVideoWidth, e.actualVideoHeight, e.mandatoryWidth, e.mandatoryHeight) ? this.info("Captured video using expected resolution.") : this.error("Incorrect captured resolution."),
          0 === e.testedFrames ? this.error("Could not analyze any video frame.") : (e.blackFrames > e.testedFrames / 3 && this.error("Camera delivering lots of black frames."),
          e.frozenFrames > e.testedFrames / 3 && this.error("Camera delivering lots of frozen frames."))
  }

}

