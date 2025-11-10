<template>
  <v-card :title="`Situazione delivery ordine ${order.id}`">
    <v-card-text>
      <p v-if="order.floor">
        Piano: {{ order.floor }}
      </p>
      <p v-if="order.elevator !== undefined">
        Ascensore: {{ order.elevator ? 'Sì' : 'No' }}
      </p>
      <p v-if="order.mark">
        Contrassegno: {{ order.mark }} €
      </p>
      <p v-if="order.operator_note">
        Note Operatore: {{ order.operator_note }}
      </p>
      <p v-if="order.customer_note">
        Note Punto Vendita: {{ order.customer_note }}
      </p>
      <v-skeleton-loader
        v-if="loadingPhoto"
        type="image"
      />
      <div v-else>
        <div v-if="motivations && motivations.length">
          <p class="text-h6">
            Motivazioni
          </p>
          <v-list dense>
            <v-list-item
              v-for="motivation in motivations"
              :key="motivation.id"
              :title="motivation.text"
            >
              <v-list-item-subtitle>
                Stato: {{ orderUtils.LABELS.find(label => label.value == motivation.status).title }} |
                <span v-if="motivation.delay">Ritardo |</span>
                <span v-if="motivation.anomaly">Anomalia |</span>
                Creata: {{ motivation.created_at }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
        <div v-else>
          Nessuna motivazione presente.
        </div>
        <div v-if="photos && photos.length">
          <div
            v-for="photo in photos"
            :key="photo"
          >
            <v-skeleton-loader 
              v-if="!imageLoading[photo]" 
              type="image" 
            />
            <v-img
              :src="`${http.hostname}order/photo/${photo}`"
              max-width="1500"
              max-height="1000"
              class="mt-4"
              @load="imageLoading[photo] = true"
            />
          </div>
        </div>
        <div v-else>
          Nessuna immagine disponibile.
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import http from '@/utils/http';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import orderUtils from '@/utils/order';

const { order } = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const photos = ref([]);
const router = useRouter();
const motivations = ref([]);
const loadingPhoto = ref(true);
const imageLoading = reactive({});

http.getRequest(`order/delivery-details/${order.id}`, {}, function (data) {
  photos.value = data.photos;
  motivations.value = data.motivations;
  loadingPhoto.value = false;
}, 'GET', router);
</script>
