<template>
  <div
    ref="fabButton"
    class="fab"
    @click="toggleWheel('open')"
  >
    <div class="fab-dots fab-dots-1" />
    <div class="fab-dots fab-dots-2" />
    <div class="fab-dots fab-dots-3" />
  </div>
  <div
    ref="fabWheel"
    class="fab-wheel"
  >
    <nav class="fab-nav">
      <v-icon
        v-if="!exportMode"
        @click="exportMode = true"
      >
        mdi-content-save
      </v-icon>
      <v-icon
        v-if="exportMode"
        @click="exportMode = false"
      >
        mdi-restore
      </v-icon>
      <div class="avatar">
        <img
          src="/logo.png"
          alt="botAvatar"
        >
      </div> 
      <div
        class="close"
        @click="toggleWheel('close')"
      >
        <div class="line" />
        <div class="line" />
      </div>
    </nav>
    <main
      v-if="!exportMode"
      ref="fabContent"
      class="fab-content"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="fab-message"
      >
        <div :class="{sender: true, bot_s: index % 2 === 0, user_s: index % 2 !== 0}">
          <img
            v-if="index % 2 === 0"
            src="/logo.png"
            alt="botAvatar"
          >
          <p>{{ index % 2 === 0 ? 'Italco.mi Bot' : 'Tu' }}</p>
        </div>

        <!-- eslint-disable vue/no-v-html -->
        <div
          :class="{msg: true, bot: index % 2 === 0, user: index % 2 !== 0}"
          v-html="marked.parse(message)"
        />
        <!-- eslint-enable vue/no-v-html -->

        <div
          v-if="loading && index == messages.length - 1"
          class="msg bot"
        >
          <span class="loading-dots"><span /><span /><span /></span>
        </div>
      </div>
    </main>
    <div 
      v-if="!exportMode"
      class="fab-send"
    >
      <input
        v-model="userMessage"
        type="text"
        placeholder="Scrivi qui..."
        :disabled="loading"
        @keyup.enter="sendMessage"
      >
      <button 
        :disabled="loading"  
        @click="sendMessage"
      >
        <v-icon>mdi-send-circle</v-icon>
      </button>
    </div>
    <div
      v-else
      class="export-chat"
    >
      <h3 v-if="!exportSuccess">
        Vuoi esportare la chat?
      </h3>
      <div
        v-if="!exportSuccess"
        class="content-button"
      >
        <button @click="exportChat">
          Si
        </button>
        <button @click="exportMode = false">
          No
        </button>
      </div>
      <div
        v-else
        class="successExport"
      >
        <div class="success-animation">
          <svg
            class="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              class="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              class="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
      </div>
    </div>
    <footer class="fab-footer">
      <p>
        Powered by
        <a
          class="link-decoration"
          target="_blank"
          href="https://fastsite.it"
        >FastSite</a>
      </p>
    </footer>
    <div
      v-show="showArrow"
      class="arrow-dynamic"
      @click="scrollToBottom"
    >
      <v-icon>mdi-arrow-down</v-icon>
    </div>
  </div>
</template>

<script setup>
import '@/styles/chatty.scss';

import http from '@/utils/http';
import { marked } from 'marked';
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick, watch } from 'vue';

const router = useRouter();
const loading = ref(false);
const fabWheel = ref(null);
const threadId = ref(null);
const fabButton = ref(null);
const fabContent = ref(null);
const showArrow = ref(false);
const exportMode = ref(false);
const userMessage = ref(null);
const exportSuccess = ref(false);
const messages = ref(['Ciao! Sono qui per rispondere alle tue domande sugli ordini.<br>Chiedimi quello che ti serve sapere specificando la data di creazione degli ordini interessati.']);

const toggleWheel = (mode) => {
  fabWheel.value.style.transform = mode == 'open' ? 'scale(1)' : 'scale(0)';
  fabButton.value.style.transform = mode == 'open' ? 'scale(0)' : 'scale(1)';
};

const sendMessage = () => {
  if(!userMessage.value) return;

  loading.value = true;
  const messageToSend = userMessage.value;
  userMessage.value = '';
  messages.value.push(messageToSend);
  http.postRequest('chatty/message', {
    message: messageToSend,
    thread_id: threadId.value
  }, (data) => {
    loading.value = false;
    if(data.status == 'ok') {
      messages.value.push(data.message);
      threadId.value = data.thread_id;
    }
  }, 'POST', router);
};

const checkScroll = () => {
  if (!fabContent.value) return;

  const el = fabContent.value;
  showArrow.value = el.scrollHeight - el.scrollTop - el.clientHeight > 10;
};

const scrollToBottom = () => {
  if (!fabContent.value) return;

  fabContent.value.scrollTo({
    top: fabContent.value.scrollHeight,
    behavior: 'smooth'
  });
  showArrow.value = false;
};

const exportChat = async () => {
  exportSuccess.value = false;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([
    messages.value.map((msg, index) => {
      return `${index % 2 === 0 ? 'Italco.mi Bot' : 'Utente'}: ${msg.replace(/<[^>]+>/g, '').trim()}`;
    }).join('\n')
  ], { type: 'text/plain' }));
  link.download = 'chat_messages.txt';
  link.click();

  exportSuccess.value = true;
  setTimeout(() => {
    exportSuccess.value = false;
    exportMode.value = false;
  }, 2000);
};


watch(messages, async () => {
  await nextTick();
  checkScroll();
});

onMounted(() => {
  if (fabContent.value) {
    fabContent.value.addEventListener('scroll', checkScroll);
    checkScroll();
  }
});
</script>
