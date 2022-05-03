const WS = new WebSocket(`ws://192.168.3.88:8080`);

WS.addEventListener("message", handleRecivedMessage);

const userName = localStorage.getItem("userName") || prompt("Enter your name");

if (!userName) {
  alert("Please enter your name");
  location.reload();
}

localStorage.setItem("userName", userName);

function handleRecivedMessage(e) {
  try {
    const parsedMessage = JSON.parse(e.data);
    const { sender, message } = parsedMessage;
    writeOnMessageBox({ sender, message });
  } catch (err) {
    console.error(err);
  }
}

function writeOnMessageBox({ sender, message }) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-row");

  const senderDiv = document.createElement("div");
  senderDiv.classList.add("sender");
  senderDiv.textContent = sender;

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.textContent = message;

  messageContainer.appendChild(senderDiv);
  messageContainer.appendChild(messageDiv);

  document.getElementById("chat").appendChild(messageContainer);
}

function handleSendMessage(e) {
  e.preventDefault();
  if (WS.readyState === WS.OPEN) {
    const messageField = document.getElementById("message-field");
    const message = messageField.value;
    WS.send(JSON.stringify({ sender: userName, message }));
    messageField.value = "";
  }
}
