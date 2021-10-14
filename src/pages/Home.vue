<template>
    <h1>Yet another url shortener</h1>
    <p>By zerobyte</p>
    <hr/>
    <zb-login-form v-if="!state.session"/>
    <div v-else>
        <div>
            You are authenticated!
            <button type="button" @click.prevent="logOut">Logout</button>
        </div>
        <zb-add-url @pushUrl="pushUrl"/>
        <zb-url-table :urls="state.shortenedUrls" @remUrl="remUrl"/>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import supabase from '../services/supabase'
import ZbLoginForm from '../components/LoginForm.vue'
import ZbUrlTable from '../components/UrlTable.vue'
import ZbAddUrl from '../components/AddUrl.vue'

const state = reactive({
    session: null,
    shortenedUrls: []
})

const fetchUrls = async () => {
    const { data, error } = await supabase.from("shortener")
        .select()
        .order('id', { ascending: false })
    if( error ) alert(error.message)
    return data;
}

const logOut = async () => {
    const { error } = await supabase.auth.signOut()
    if(error) alert(error.message)
    else state.session = null;
}

const pushUrl = (url) => {
    state.shortenedUrls.unshift(url)
}

const remUrl = (url) => {
    const index = state.shortenedUrls.findIndex(item=>item.id === url.id)
    console.log({ url, index })
    state.shortenedUrls.splice(index,1)
}

onMounted(async()=>{
    state.session = supabase.auth.user()
    await supabase.auth.onAuthStateChange( async (event, session) => {
        if(session && session.user) { 
            state.session = session.user
            state.shortenedUrls = await fetchUrls()
        }
    })
    if(state.session){
        state.shortenedUrls = await fetchUrls()
    }
})

</script>