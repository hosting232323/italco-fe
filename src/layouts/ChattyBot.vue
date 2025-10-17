<template>
  <div class="fab" id="fabButton" @click="toggleWheel('open')">
    <div class="fab-dots fab-dots-1"></div>
    <div class="fab-dots fab-dots-2"></div>
    <div class="fab-dots fab-dots-3"></div>
  </div>

  <div class="fab-wheel">

      <nav class="fab-nav">
        
          <v-icon id="export-button">mdi-content-save</v-icon>

          <div class="avatar">
              <img src="/logo.png" alt="botAvatar">
              <p id="botName"></p>
          </div> 
          <div class="close" id="closeButton" @click="toggleWheel('close')">
              <div class="line"></div>
              <div class="line"></div>
          </div>
      </nav>
      
      <main class="fab-content">
        <div class="fab-message" style="margin-top: 15px;">
          <div class="sender bot_s">
              <img src="/logo.png" alt="botAvatar">
              <p>Italco Bot</p>
          </div>

          <div class="msg bot first">Come posso aiutarti?</div>
        </div>
      </main>

      <div class="arrow-dynamic arrow-dynamic-hidden">
        <i class="fa-solid fa-arrow-down"></i>
      </div>
      
      <div class="fab-send">

        <input
          v-model="userMessage"
          type="text"
          name="userMsg"
          id="userMsg"
          placeholder="Scrivi qui..."
          @input="onInputChangeColor" 
          @keyup.enter="sendMessage"
          :disabled="loading"
        />
          <button 
            @click="sendMessage"  
            :disabled="loading"
          >
            <v-icon id="export-button">mdi-send-circle</v-icon>
          </button>
          
      </div>

      <div style="display: none;" class="export-chat">
        <h3 id="textExport">Vuoi esportare la chat?</h3>
        <div class="content-button">
          <button id="yesExport">Si</button>
          <button id="noExport">No</button>

        </div>

        <div style="display: none;" class="successExport">
          <div class="success-animation">
            <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" /><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
          </div>
        </div>

      </div>

      <footer class="fab-footer">
          <p>Powered by <a class="link-decoration" target="_blank" href="https://fastsite.it">FastSite</a></p>
      </footer>

  </div>
</template>

<script setup>
import '@/styles/fab.css';
import '@/styles/chat.css';

import { ref } from 'vue';
import http from '@/utils/http';
import { useRouter } from 'vue-router';
import { marked } from 'marked';

const router = useRouter();
const userMessage = ref(null);
const loading = ref(false);

async function toggleWheel(mode) {
  if (mode == "open") {
    document.querySelector(".fab-wheel").style.transform = "scale(1)";
    document.getElementById("fabButton").style.transform = "scale(0)";
  } else {
    document.querySelector(".fab-wheel").style.transform = "scale(0)";
    document.getElementById("fabButton").style.transform = "scale(1)";
  }
}

const sendMessage = () => {
  if(!userMessage.value) return;

  loading.value = true;
  addMessage(userMessage.value, false);
  userMessage.value = '';
  http.postRequest('chatty/message', {
    message: userMessage.value
  }, (data) => {
    if(data.status == 'ok')
      addMessage(data.message, true);
    loading.value = false;
  }, 'POST', router);
};

const addMessage = (message, bot = true) => {
  var fabContent = document.querySelector('.fab-content');

  const messageContainer = createElement('div', '', ['fab-message']);
  const paragraph = createElement('p', '', [], '');

  if (bot) {
    const botMessage = createElement('div', '', ['sender', 'bot_s']);
    const image = document.createElement('img');
    image.src = `/logo.png`;
    botMessage.appendChild(image);
    paragraph.textContent = 'Italco Bot';
    botMessage.appendChild(paragraph);
    messageContainer.appendChild(botMessage);
  } else {
    const userMessage = createElement('div', '', ['sender', 'user_s']);
    paragraph.textContent = "Tu";
    userMessage.appendChild(paragraph);
    messageContainer.appendChild(userMessage);
  }

  const newMessage = createElement('div', '', ['msg', ...(bot ? ['bot', 'first'] : ['user'])],'');
  newMessage.innerHTML = marked.parse(message);
  messageContainer.appendChild(newMessage);
  fabContent.appendChild(messageContainer);
};

const createElement = (type = '', id = '', classes = [], content = '') => {
  const element = document.createElement(type);
  if(id !== '') element.id = id;
  if(classes.length > 0) element.classList.add(...classes);
  if(content !== '') element.textContent = content;
  return element;
};

const onInputChangeColor = () => {
  const userMsg = document.getElementById("userMsg");
  userMsg.value.trim() !== '' ? userMsg.style.color = '#000' : userMsg.style.color = '';
}
</script>
