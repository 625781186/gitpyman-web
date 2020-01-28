<!--temp-->
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
   <v-card>
      <v-card-title style="background-color: dodgerblue;">
         Table
         <v-spacer></v-spacer>
         <v-btn
                 :loading="loading"
                 :disabled="loading"
                 color="secondary"
                 @click="getItems"
         >
            Get Data
         </v-btn>
         <v-spacer></v-spacer>
         <v-text-field
                 v-model="search"
                 append-icon="search"
                 label="Search"

                 hide-details
         ></v-text-field>
      </v-card-title>
      <v-data-table
              :headers="headers"
              :items="desserts"
              :search="search"
      >
         <template v-slot:items="props">
            <td>
               <a :href='props.item.query_field.replace(/[\\]/g, "/")' target="_bank">
                  <span>{{ props.item.query_field }}</span>
               </a>
            </td>
            <td class=“text-xs-right>{{ props.item.comment }}</td>
            <td class="justify-center layout">
               <v-icon
                       small
                       @click="deleteItem(props.item)"
               >
                  delete
               </v-icon>
            </td>
            <td class="text-xs-right">{{ props.item.position }}</td>
         </template>
         <template v-slot:no-results>
            <v-alert :value="true" color="error" icon="warning">
               Your search for "{{ search }}" found no results.
            </v-alert>
         </template>

      </v-data-table>
   </v-card>
</template>
<!--JS-->
<script>

    export default {
        props  : {
            db_factory: Object,
        },
        data() {
            return {
                loader : null,
                loading: false,
                search : '',

                headers : [
                    {text: 'Query Field', value: 'query_field', sortable: false,},
                    {text: 'Comment', value: 'comment', sortable: false},
                    {text: 'Actions', value: 'name', sortable: false},
                    {text: 'Position', value: 'position', sortable: false},
                ],
                desserts: [],
            }
        },
        created() {
            // this.desserts = [
            //     {
            //         query_field: '\\YMFE\\yapi',
            //         comment    : "测试",
            //         position   : "https://github.com/625781186?tab=followers",
            //     },
            // ]
        },
        methods: {

            getItems() {
                this.loader = 'loading';

                this.get_all_doc();
            },

            get_all_doc() {
                let docRef = this.db_factory.db.collection("users")
                let that   = this;
                that.desserts.splice(0);
                docRef.get()
                    .then(function (doc) {
                        for (let i of doc.docs) {
                            that.desserts.push(i.data());
                        }

                    })
                    .catch(function (error) {
                        console.log("Error getting document:", error);
                        // let comment = "error db.";
                        // addDom_TextArea(index,comment,query_field)
                    });
            },
            deleteItem(item) {
                const index = this.desserts.indexOf(item);
                confirm('Are you sure you want to delete this doc?') && this.delete_doc(index, item);
            },
            delete_doc(index, item) {
                this.desserts.splice(index, 1);
                this.db_factory.db_delete_doc(item.query_field);
            },

        },

        computed: {},

        watch: {
            loader() {
                const l = this.loader;
                this[l] = !this[l];
                setTimeout(() => (this[l] = false), 3000);
                this.loader = null;
            },
        },
    }
</script>
<!--CSS-->
<style scoped>
   [v-cloak] {
      display: none
   }

   .layout {
      display: table-cell;
   }
</style>
