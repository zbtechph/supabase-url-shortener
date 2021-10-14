<template>
    <h3>Add url</h3>
    <button type="button" @click="state.form.key = randomStr(5)">Random Key</button>
    <form action="/" method="POST" @submit.prevent="addUrl">
        <div>
            <label>KEY</label>
            <input type="text" v-model="state.form.key"/>
        </div>
        <div>
            <label>Long URL</label>
            <input type="text" v-model="state.form.longurl"/>
        </div>
        <div>
            <button type="submit" :disabled="state.loader">SUBMIT</button>
        </div>
    </form>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import supabase from '../services/supabase'

const state = reactive({
    loader: false,
    errors: null,
    form: {
        longurl: "",
        key: "",
    }
})

const addUrl = async () => {
    state.loader = true;
    const { data, error } = await supabase.from("shortener")
        .insert({ ...state.form, owner: supabase.auth.user().id })
    console.log({ data, error })
    if(error) alert(error.message)
    else state.form.longurl = "", state.form.key = randomStr(5), emit("pushUrl", data[0]);
    state.loader = false;
}

const randomStr = (length = 8) => {
    return Math.random().toString(16).substr(2, length);
};

onMounted(()=>state.form.key = randomStr(5))

const emit = defineEmits([
    'pushUrl'
])

</script>