<template>
  <div class="my-6">
    <v-card variant="tonal">
      <v-card-text class="pa-8">
        <v-chip
          size="small"
          class="mb-4"
          prepend-icon="mdi-lock-outline"
        >
          Non ancora attiva per la tua attività
        </v-chip>
        <h2 class="text-h4 mb-2">
          Pianificazione automatica: dal giorno alla consegna, senza fogli di calcolo.
        </h2>
        <p class="text-body-1 mb-0">
          Definisci una volta dove e quando ogni veicolo copre il territorio: Hubstra propone al punto vendita
          solo date e fasce che puoi davvero rispettare e compone da solo i borderò.
        </p>
      </v-card-text>
    </v-card>

    <v-row class="mt-4">
      <v-col
        v-for="feature in features"
        :key="feature.title"
        cols="12"
        md="4"
      >
        <v-card height="100%">
          <v-card-text>
            <v-icon
              :icon="feature.icon"
              size="36"
              class="mb-3"
            />
            <div class="text-h6 mb-1">
              {{ feature.title }}
            </div>
            <div class="text-body-2 text-medium-emphasis">
              {{ feature.text }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      class="mt-4"
      type="info"
      variant="tonal"
      icon="mdi-rocket-launch-outline"
    >
      Vuoi attivarla? Contatta il tuo referente Hubstra: i vincoli configurati nella scheda accanto
      alimenteranno subito le proposte.
    </v-alert>
  </div>
</template>

<script setup>
const features = [
  {
    icon: 'mdi-map-marker-radius',
    title: 'Copertura geografica per veicolo',
    text: 'Assegna CAP o zone disegnate sulla mappa a ogni veicolo, giorno per giorno e per fascia oraria.'
  },
  {
    icon: 'mdi-calendar-check',
    title: 'Date e fasce sempre rispettabili',
    text: 'Il punto vendita vede solo le disponibilità reali: niente consegne promesse fuori zona o fuori orario.'
  },
  {
    icon: 'mdi-text-box-multiple-outline',
    title: 'Borderò proposti in automatico',
    text: 'Gli ordini vengono raggruppati per vicinanza e assegnati al veicolo giusto: tu confermi con un click.'
  },
  {
    icon: 'mdi-truck-fast',
    title: 'Precarico dei punti di ritiro',
    text: 'Decidi quali punti di ritiro accettano il precarico: il ritiro si sposta alla vigilia e la giornata si alleggerisce.'
  },
  {
    icon: 'mdi-timer-sand',
    title: 'Meno tempo al telefono',
    text: 'Le ripianificazioni manuali diventano un controllo: l’ufficio gestisce le eccezioni, non la routine.'
  },
  {
    icon: 'mdi-shield-check-outline',
    title: 'Vincoli sempre applicati',
    text: 'Limiti per area, per punto vendita e per servizio guidano ogni proposta, senza doverli ricordare.'
  }
];
</script>
