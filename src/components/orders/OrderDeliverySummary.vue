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
            :key="photoKey(photo)"
          >
            <v-skeleton-loader 
              v-if="!imageLoading[photoKey(photo)]" 
              type="image" 
            />
            <v-img
              :src="resolvePhotoSrc(photo)"
              max-width="1500"
              max-height="1000"
              class="mt-4"
              @load="imageLoading[photoKey(photo)] = true"
            />
            <v-btn
              v-if="photoId(photo) != null"
              class="mt-2 mr-2"
              size="small"
              variant="tonal"
              @click="downloadPhotoPdf(photo)"
            >
              Scarica PDF
            </v-btn>
            <v-btn
              v-if="photoId(photo) != null"
              class="mt-2"
              size="small"
              variant="tonal"
              @click="downloadPhotoPdfScanned(photo)"
            >
              Scarica PDF scannerizzato
            </v-btn>
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

const photoLink = (photo) => {
  if (photo && typeof photo === 'object' && photo.link)
    return photo.link;
  return photo;
};

const photoKey = (photo) => {
  if (photo && typeof photo === 'object' && photo.id != null)
    return photo.id;
  return photoLink(photo);
};

const photoId = (photo) => {
  if (photo && typeof photo === 'object' && photo.id != null)
    return photo.id;
  return null;
};

const resolvePhotoSrc = (photo) => {
  const link = photoLink(photo);
  if (!link || typeof link !== 'string')
    return link;

  if (link.startsWith('data:'))
    return link;

  try {
    const parsed = new URL(link);
    if (parsed.pathname.includes('/order/photos/'))
      return link;

    if (parsed.pathname.includes('/photos/test/') || parsed.pathname.includes('/photos/prod/')) {
      const filename = parsed.pathname.split('/').pop();
      return `${http.hostname}order/photos/${filename}`;
    }
  } catch {
    // Keep original value if URL parsing fails.
  }

  return link;
};

const downloadPhotoPdf = (photo) => {
  const id = photoId(photo);
  if (id == null)
    return;
  http.getRequest(`export/order-photo/${id}`, {}, function (data) {
    if (data.status == 'ko')
      alert(data.error);
    else {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bolla_ordine_${order.id}_foto_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, 'GET', router);
};

const downloadPhotoPdfScanned = (photo) => {
  const id = photoId(photo);
  if (id == null)
    return;
  http.getRequest(`export/order-photo-scanned/${id}`, {}, function (data) {
    if (data.status == 'ko')
      alert(data.error);
    else {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bolla_ordine_${order.id}_foto_${id}_scannerizzato.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, 'GET', router);
};

http.getRequest(`order/delivery-details/${order.id}`, {}, function (data) {
  photos.value = data.photos;
  motivations.value = data.motivations;
  loadingPhoto.value = false;
}, 'GET', router);
</script>
