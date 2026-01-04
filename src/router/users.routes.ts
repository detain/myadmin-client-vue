
export default {
    path: '/users',
    //component: Layout,
    children: [
        { path: '', component: () => import('../views/users/List.vue') },
        { path: 'add', component: () => import('../views/users/AddEdit.vue') },
        { path: 'edit/:id', component: () => import('../views/users/AddEdit.vue') },
    ],
};
