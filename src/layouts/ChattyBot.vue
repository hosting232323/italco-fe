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
      <v-icon>mdi-content-save</v-icon>
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
        <div
          :class="{msg: true, bot: index % 2 === 0, user: index % 2 !== 0}"
          v-html="marked.parse(message)"
        />
        <div
          v-if="loading && index == messages.length - 1"
          class="msg bot"
        >
          <span class="loading-dots"><span /><span /><span /></span>
        </div>
      </div>
    </main>
    <div class="fab-send">
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
import http from '@/utils/http';
import { marked } from 'marked';
import { useRouter } from 'vue-router';
import { ref, onMounted, nextTick, watch } from 'vue';

const router = useRouter();
const loading = ref(false);
const fabWheel = ref(null);
const fabButton = ref(null);
const fabContent = ref(null);
const showArrow = ref(false);
const userMessage = ref(null);
const messages = ref(['Ciao! Sono qui per rispondere alle tue domande sugli ordini dell\'ultima settimana']);

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
    message: messageToSend
  }, (data) => {
    loading.value = false;
    if(data.status == 'ok')
      messages.value.push(data.message);
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

<style scoped>
@keyframes blink {
  50% {
    opacity: 0.25;
  }
}

* {
  box-sizing: border-box;
  margin: 0px; 
  padding: 0px;
}

.fab {
  position: fixed;
  height: 4rem;
  bottom: 0;
  right: 0;
  margin: 30px 30px 125px;
  width: 4rem;
  background: rgb(53, 76, 124);
  box-shadow: 0px 5px 20px rgba(38, 55, 90, 0.5);
  border: 1px solid rgb(38, 55, 90);
  border-radius: 50%;
  border-bottom-right-radius: 6px;
  cursor: pointer;
  z-index: 99;
  transform: scale(1);
  transform-origin: bottom right;
  transition: all 0.3s ease;
  
}

.fab:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.fab:hover {
  background: rgb(71, 96, 156);
  box-shadow: 0px 5px 20px 5px rgba(38, 55, 90, 0.5);
}

.fab-dots {
  position: absolute;
  height: 8px;
  width: 8px;
  background-color: #fff;
  border-radius: 50%;
  top: 50%;
  transform: translateX(0%) translateY(-50%) rotate(0deg);
  opacity: 1;
  animation: blink 3s ease infinite;
  transition: all 0.3s ease;
}

.fab-dots-1 {
  left: 15px;
  animation-delay: 0s;
}

.fab-dots-2 {
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  animation-delay: 0.4s;
}

.fab-dots-3 {
  right: 15px;
  animation-delay: 0.8s;
}

.fab .fab-dots-2 {
  transform: translateX(-50%) translateY(-50%) rotate(0deg);
}

@media screen and (max-width: 768px) {
  .fab-wrapper {
    bottom: 15px;
    right: 15px;
  }

  .fab {
    height: 60px;
    width: 60px;
  }

  .fab-dots {
    height: 6px;
    width: 6px;
  }
}

.fab-wheel {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 45px;
  height: calc(100vh - 200px);
  width: 470px;
  display: flex;
  flex-direction: column;
  border-radius: 30px;
  color: white;
  background-color: #eaeef3;
  z-index: 9999;
  transform: scale(0);
  transform-origin: bottom right;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  font-family: 'Roboto', sans-serif;
}

.fab-nav {
  height: 110px;
  display: flex;
  flex-shrink: 0;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0px 15px 60px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  position: relative;
}

.fab-nav i {
  color: rgb(53, 76, 124);
  font-size: 30px;
  cursor: pointer;
  width: 30px;
  transition: color 0.3s ease;
}

.fab-nav i:hover {
  color: rgb(71, 96, 156);
}

.close {
  width: 32px;
  height: 32px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.close .line {
  width: 35px;
  height: 5px;
  background-color: rgb(53, 76, 124);
  position: absolute;
  top: 45%;
  transform: translateY(-50%);
  transition: background-color 0.3s ease;
}

.close:hover .line {
  background-color: rgb(71, 96, 156);
}

.line:nth-child(1) {
  transform: rotate(45deg);
}

.line:nth-child(2) {
  transform: rotate(-45deg);
}

.avatar {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.avatar img {
  width: 75px;
}

.fab-content {
  position: relative;
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 25px 10px;
  display: flex;
  flex-direction: column;
  padding-top: 15px;
}

.fab-content .bot {
  align-self: flex-start;
  border-radius: 0 25px 25px 25px !important;
}

.fab-content .user {
  align-self: flex-end;
  border-radius: 25px 0 25px 25px !important;
}

.fab-content .msg {
  background-color: #fff;
  padding: 15px 20px;
  color: #000;
  border-radius: 25px;
  margin: 5px 0;
  line-height: 20px;
  display: inline-block;
  font-size: 14px;
}

.fab-content .msg p {
  width: auto;
}

.fab-message .msg.bot ol {
  padding-left: 30px;
}

.fab-message .msg.bot ul {
  padding-left: 30px;
}

.fab-message .msg.bot img {
  height: 500px;
}

.fab-message {
  display: flex;
  flex-direction: column;
}

.fab-content .sender {
  display: flex;
  align-items: center;
  color: #000;
  font-size: 14px;
}

.fab-content .bot_s img {
  height: 40px;
  margin-right: 8px;
}

.user_s {
  margin-top: 5px;
  align-self: flex-end;
}

.fab-send {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0px -15px 60px rgba(0, 0, 0, 0.1);
  z-index: 999;
}

.fab-send input {
  border-radius: 30px 0 0 0;
  height: 70px;
  width: 80%;
  border: none;
  padding-left: 40px;
  font-size: 15px;
  color: #969ba6;
  outline: none;
  background-color: #fff;
}

.fab-send button {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  width: 20%;
  font-size: 20px;
  background-color: #fff;
  color: rgb(53, 76, 124);
  border: none;
  border-radius: 0 30px 0 0;
  cursor: pointer;
  transition: color 0.3s ease;
}

.fab-send button:hover {
  color: rgb(71, 96, 156);
}

.fab-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-top: 1px solid;
  border-top-color: #eaeaea;
  background-color: #f9f9f9;
  border-radius: 0 0 30px 30px;
  color: #000;
  flex-shrink: 0;
  font-size: 14px;
}

@keyframes scale {
  0% {
    transform: none;
  }

  100% {
    transform: scale(1);
  }
}

@media screen and (max-width: 768px) {
  .fab-wheel {
    margin: 0;
    height: 100%;
    width: 100vw;
    border-radius: 0;
  }

  .fab-nav {
    height: 75px;
    border-radius: 0;
    width: 100vw;
  }

  .fab-footer {
    height: 40px;
    font-size: 12px;
    border-radius: 0;
    padding: 0 10px;
  }

  .avatar p {
    margin-top: 0px;
    margin-bottom: 10px;
  }
}

.link-decoration {
  color: var(--theme-color);
  text-decoration: none;
}

.link-decoration:hover {
  text-decoration: underline;
}

.arrow-dynamic {
  position: absolute;
  bottom: 130px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background-color: #fff;
  color: rgb(71, 96, 156);
  width: 30px;
  height: 30px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 4px 0px rgb(0 0 0 / 20%);
  font-size: 12px;
  cursor: pointer;
}

.loading-dots {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 12px;
}

.loading-dots span {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #000;
  animation: dot-blink 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(1) { animation-delay: 0s; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-blink {
  0%, 80%, 100% { opacity: 0.3; transform: scale(1); }
  40% { opacity: 1; transform: scale(1.2); }
}
</style>

<style>
ol, ul{
  padding-left: 30px;
}
</style>
