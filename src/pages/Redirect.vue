<template>
  <div v-if="uinfo">
    <h1>Redirect</h1>
    <p v-if="autoRedirect">
      You will be redirected automatically.. <button type="button" @click.prevent="cancelRedirect">Cancel</button><br/>
      Or click <a :href="uinfo.longurl" @click="linkTick">here</a>
    </p>
    <p v-else>
      Automatic redirect has been canceled!<br/>
      You can continue to the destination by clicking <a :href="uinfo.longurl" @click.prevent="linkTick">here</a>.
    </p>
    <p>Your destination: <pre>{{ uinfo.longurl }}</pre></p>
  </div>
  <div v-else>
    <h1>404 Page not found</h1>
  </div>
</template>

<script setup>
  import supabase from '../services/supabase'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const ukey = computed(()=>route.params.ukey)
  const uinfo = ref(null)
  const timer = ref(null)
  const autoRedirect = ref(true)
  
  const addTick = async () => {
    console.log(uinfo.value);
    const { data, error } = await supabase.from("shortener_ticks")
      .insert({
        shortener: uinfo.value.id,
        metas: JSON.stringify({
          userAgent: navigator.userAgent
        })
      })
    if(error) alert(error.message)
    else return data;
  }
  
  const cancelRedirect = () => {
    clearTimeout(timer.value);
    autoRedirect.value = false;
  }

  const linkTick = async () => {
    cancelRedirect();
    await addTick();
    window.location = uinfo.value.longurl;
  }

  onMounted( async()=>{
    const { data, error } = await supabase
      .from('shortener')
      .select('longurl, id')
      .eq('key', ukey.value)
    if(error) alert(error.message)
    if(data.length > 0) { 
      uinfo.value = data[0]
      timer.value = window.setTimeout(async ()=>{
        await addTick();
        window.location = uinfo.value.longurl;
      }, 2500)
    }    
  })

</script>