
<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => { return new Date().getFullYear() })
</script>

<template>
    <footer class="dashboard-footer">
        <div class="container">
            <p>&copy; {{ currentYear }} My Company</p>
        </div>
    </footer>
</template>



<style scoped>
.dashboard-footer {
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: center;
}
</style>