<template>
  <div class="container partners reveal">
    <p>Una piattaforma per chi vende,<br>chi organizza e chi consegna.</p>
    <div>
      <span>Punto vendita</span>
      <span>Ufficio</span>
      <span>Squadre</span>
    </div>
  </div>
</template>

<style scoped>
.partners {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--line);
  padding: 30px 0 45px;
  gap: 25px;
}
.partners p {
  color: #777;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}
.partners div {
  display: flex;
  gap: 65px;
  color: #555;
  font-size: 18px;
  letter-spacing: -.5px;
}
@media (max-width: 1000px) {
  .partners div {
    gap: 35px;
  }
}
@media (max-width: 650px) {
  .partners {
    display: block;
    padding: 25px 0;
  }
  .partners p {
    margin-bottom: 17px;
    font-size: 12px;
  }
  .partners div {
    justify-content: space-between;
    gap: 10px;
    font-size: 14px;
  }
}
</style>
