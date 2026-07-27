(function () {
  "use strict";

  let isOpen = false;
  let isLoading = false;
  let messageHistory = [];

  function leoFormatTime(ts) {
    const d = new Date(ts);
    const h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${m} ${ampm}`;
  }

  function leoEscapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function leoCreateWidget() {
    // FAB Button
    const fab = document.createElement("button");
    fab.id = "leo-chatbot-fab";
    fab.setAttribute("aria-label", "Open chat");
    fab.innerHTML = `
      <svg class="leo-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <svg class="leo-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;
    fab.onclick = leoToggleChat;
    document.body.appendChild(fab);

    // Chat Window
    const win = document.createElement("div");
    win.id = "leo-chatbot-window";
    win.innerHTML = `
      <div id="leo-chatbot-header">
        <div class="leo-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a7 7 0 0 1-5.46 2.54A7 7 0 0 1 9.27 19H8a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
            <circle cx="9.5" cy="14.5" r="1"/><circle cx="14.5" cy="14.5" r="1"/>
          </svg>
        </div>
        <div class="leo-info">
          <h3>LeoMart Assistant</h3>
          <p><span class="leo-status-dot"></span>Online</p>
        </div>
      </div>
      <div id="leo-chatbot-messages">
        <div class="leo-welcome">
          <div class="leo-welcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h4>Welcome to LeoMart!</h4>
          <p>How can we help you today? Ask about products, orders, payments, or anything else.</p>
        </div>
      </div>
      <div id="leo-chatbot-input-area">
        <textarea id="leo-chatbot-input" placeholder="Type your message..." rows="1"></textarea>
        <button id="leo-chatbot-send" aria-label="Send message" disabled>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    `;
    document.body.appendChild(win);

    const input = document.getElementById("leo-chatbot-input");
    const sendBtn = document.getElementById("leo-chatbot-send");

    input.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 100) + "px";
      sendBtn.disabled = !this.value.trim() || isLoading;
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!sendBtn.disabled) leoSendMessage();
      }
    });

    sendBtn.addEventListener("click", leoSendMessage);
  }

  function leoToggleChat() {
    isOpen = !isOpen;
    const fab = document.getElementById("leo-chatbot-fab");
    const win = document.getElementById("leo-chatbot-window");

    if (isOpen) {
      fab.classList.add("leo-chat-open");
      win.classList.add("leo-chat-visible");
      setTimeout(() => {
        document.getElementById("leo-chatbot-input").focus();
      }, 300);
    } else {
      fab.classList.remove("leo-chat-open");
      win.classList.remove("leo-chat-visible");
    }
  }

  function leoAddMessage(role, content, timestamp) {
    const messages = document.getElementById("leo-chatbot-messages");
    // Remove welcome message on first real message
    const welcome = messages.querySelector(".leo-welcome");
    if (welcome) welcome.remove();

    const msgDiv = document.createElement("div");
    msgDiv.className = `leo-msg leo-msg-${role === "user" ? "user" : "ai"}`;

    const bubble = document.createElement("div");
    bubble.className = "leo-msg-bubble";
    bubble.textContent = content;

    const time = document.createElement("div");
    time.className = "leo-msg-time";
    time.textContent = leoFormatTime(timestamp);

    msgDiv.appendChild(bubble);
    msgDiv.appendChild(time);
    messages.appendChild(msgDiv);

    messages.scrollTop = messages.scrollHeight;
  }

  function leoShowTyping() {
    const messages = document.getElementById("leo-chatbot-messages");
    const typing = document.createElement("div");
    typing.id = "leo-chatbot-typing";
    typing.className = "leo-msg leo-msg-ai";
    typing.innerHTML = `
      <div class="leo-msg-bubble">
        <div class="leo-typing">
          <div class="leo-typing-dot"></div>
          <div class="leo-typing-dot"></div>
          <div class="leo-typing-dot"></div>
        </div>
      </div>
    `;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function leoHideTyping() {
    const typing = document.getElementById("leo-chatbot-typing");
    if (typing) typing.remove();
  }

  async function leoSendMessage() {
    const input = document.getElementById("leo-chatbot-input");
    const sendBtn = document.getElementById("leo-chatbot-send");
    const text = input.value.trim();

    if (!text || isLoading) return;

    isLoading = true;
    sendBtn.disabled = true;
    input.value = "";
    input.style.height = "auto";

    const userTime = Date.now();
    leoAddMessage("user", text, userTime);
    messageHistory.push({ role: "user", content: text });

    leoShowTyping();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messageHistory.slice(-10),
        }),
      });

      const data = await response.json();

      leoHideTyping();

      if (data.success && data.data && data.data.reply) {
        leoAddMessage("ai", data.data.reply, data.data.timestamp || Date.now());
        messageHistory.push({ role: "assistant", content: data.data.reply });
      } else {
        leoAddMessage(
          "ai",
          data.message || "Sorry, something went wrong. Please try again.",
          Date.now()
        );
      }
    } catch (err) {
      leoHideTyping();
      leoAddMessage(
        "ai",
        "Unable to connect to the server. Please check your connection and try again.",
        Date.now()
      );
    }

    isLoading = false;
    sendBtn.disabled = !input.value.trim();
    input.focus();
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", leoCreateWidget);
  } else {
    leoCreateWidget();
  }
})();
