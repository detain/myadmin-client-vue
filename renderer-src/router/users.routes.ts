import List from '../views/users/List.vue';
import AddEdit from '../views/users/AddEdit.vue';

export default {
    path: '/users',
    //component: Layout,
    children: [
        { path: '', component: List },
        { path: 'add', component: AddEdit },
        { path: 'edit/:id', component: AddEdit },
    ],
};
