<template>
    <h3>Your urls</h3>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>KEY</th>
                <th>LONG URL</th>
                <th>Created at</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in props.urls" :key="item.id">
                <td>{{ item.id }}</td>
                <td><a :href="getFullUrl(item)">{{ item.key }}</a></td>
                <td><a :href="item.longurl">{{ item.longurl }}</a></td>
                <td>{{ moment(item.created_at).fromNow() }}</td>
                <td>
                    <button class="btn-cb" type="button" :data-clipboard-text="getFullUrl(item)">COPY</button>
                    <button type="button" @click.prevent="deleteUrl(item)">DELETE</button>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { onMounted } from 'vue'
import supabase from '../services/supabase'
import clipboard from 'clipboard'
import moment from 'moment'

const props = defineProps({
    urls: Array
})

const getFullUrl = item => {
    return window.location.href.concat(item.key);
}

const removeTicks = async ( item ) => {
    const {data, error} = await supabase.from("shortener_ticks")
        .delete()
        .match({
            shortener: item.id
        })
    if(error) alert(error.message)
    console.log({remove: data})
}

const deleteUrl = async (item) => {
    const ans = confirm(`${item.key} will be deleted?`)
    if(ans) {
        await removeTicks(item)
        const { data, error } = await supabase.from('shortener')
            .delete()
            .match({ id: item.id })
        
        if(error) alert(error.message)
        else emit("remUrl", data[0])
    }
}

onMounted(()=>{
    new clipboard(".btn-cb")
})

const emit = defineEmits(['remUrl'])

</script>