<template>

    <div v-if="state.authErrors">
        {{ state.authErrors.message }}
    </div>
    <form method="POST" action="/" @submit.prevent="attemptLogin">
        <div>
            <label>Email address</label>
            <input type="email" v-model="state.credential.email" required/>
        </div>
        <div>
            <label>Password</label>
            <input type="password" v-model="state.credential.password" required/>
        </div>
        <div>
            <button type="submit" :disabled="state.authLoader">Submit</button>
        </div>
    </form>

</template>

<script setup>
import { reactive } from 'vue'
import supabase from '../services/supabase'

const state = reactive({
    loader: false,
    errors: null,
    credential: {
        email: "",
        password: ""
    }
})

const attemptLogin = async () => {
    state.loader = true;
    state.errors = null;
    const { error } = await supabase.auth.signIn(state.credential)
    if(error) state.errors = error;
    state.credential.password = "";
    state.loader = false;
}

</script>