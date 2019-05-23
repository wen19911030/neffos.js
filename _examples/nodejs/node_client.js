/// <reference path="../../type_definitions/neffos.d.ts" />
const neffos = require('neffos');
const stdin = process.openStdin();

const wsURL = "ws://localhost:8080/echo";
async function runExample() {
  try {
    var conn = await neffos.Dial(wsURL, {
      default: {
        _OnNamespaceConnected: function (ns, msg) {
          console.log("connected to namespace: " + msg.Namespace);
        },
        _OnNamespaceDisconnect: function (ns, msg) {
          console.log("disconnected from namespace: " + msg.Namespace);
        },
        _OnRoomJoined: function (ns, msg) {
          console.log("joined to room: " + msg.Room);
        },
        _OnRoomLeft: function (ns, msg) {
          console.log("left from room: " + msg.Room);
        },
        chat: function (ns, msg) {
          let prefix = "Server says: ";

          if (msg.Room !== "") {
            prefix = msg.Room + " >> ";
          }
          console.log(prefix + msg.Body);
        }
      }
    });

    var nsConn = await conn.Connect("default");
    nsConn.Emit("chat", "Hello from client side!");

    stdin.addListener("data", function (data) {
      const text = data.toString().trim();
      nsConn.Emit("chat", text);
    });

  } catch (err) {
    console.error(err);
  }
}

runExample();
