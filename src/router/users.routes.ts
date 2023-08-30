const List = () => import(/* webpackChunkName: "users" */ '@/views/users/List.vue');
const AddEdit = () => import(/* webpackChunkName: "users" */ '@/views/users/AddEdit.vue');

export default {
    path: '/users',
    //component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit },
    ],
};
