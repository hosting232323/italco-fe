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

          <div class="fab-message">
              
              <div class="sender bot_s">
                  <img src="/logo.png" alt="botAvatar">
                  <p>Italco Bot</p>
              </div>

              <div class="msg bot first">Come posso aiutarti?</div>
            </div>
          
          <div id="faq" class="faq-container"></div>
          
      </main>

      <div class="arrow-dynamic arrow-dynamic-hidden">
        <i class="fa-solid fa-arrow-down"></i>
      </div>
      
      <div class="fab-send">
          <input type="text" name="userMsg" id="userMsg" placeholder="Scrivi qui...">
          <button id="send-button">
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

async function toggleWheel(mode) {
    if (mode == "open") {
        document.querySelector(".fab-wheel").style.transform = "scale(1)";
        document.getElementById("fabButton").style.transform = "scale(0)";
    } else {
        document.querySelector(".fab-wheel").style.transform = "scale(0)";
        document.getElementById("fabButton").style.transform = "scale(1)";
    }
}


</script>