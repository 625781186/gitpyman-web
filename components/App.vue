<!--temp-->
<template>
   <v-app id="myapp" style='z-index:5;
                color:red;
                position : fixed;
                top : 64px;
                left: 0;

                backgroundColor : "#232322"; '>
      <v-layout column align-center style="width: 160px">
         <v-btn @click="to_watching">to watching</v-btn>
         <v-checkbox v-model="remark_state" label="need remark" class="ma-0"></v-checkbox>
         <i-switch
                 class="ma-0"
                 size="large"
                 :value="show_table_state"
                 v-model="show_table_state"
         >
            <span slot="open">Show</span>
            <span slot="close">Hide</span>
         </i-switch>
      </v-layout>
      <Tabs v-show="show_table_state"
            value="name1"
            style="max-width:800px;
                   background-color: #ffffff!important;
                   border: 2px solid;">
         <TabPane label="Tab 1" name="name1">
            <VVTable :db_factory="db_factory"></VVTable>
         </TabPane>
         <TabPane label="Tab 2" name="name2">You can customize the extension.</TabPane>
      </Tabs>

   </v-app>
</template>
<!--JS-->
<script>

    import {TabManager} from "../github_vue_tab.js"
    import {DBManager} from "../github_vue_db.js"
    import VVTable from './table.vue'
    import bus from "../github_vue_bus.js"

    export default {
        components: {VVTable},
        data() {
            return {

                QUERY_FIELD_LIST : {},
                db_factory       : null,
                db_factory_backup: null,
                show_table_state : true,
                remark_state     : true,
            }
        },
        created() {


            this.db_factory        = DBManager.get_factory('firebase');
            this.db_factory_backup = this.db_factory;

            this.show_table_state = eval(localStorage.getItem("show_table_state"));
            this.remark_state     = eval(localStorage.getItem("remark_state"));
        },
        mounted() {

            var timeoutflag   = null;
            var that          = this;
            ///*1. dom change event*/
            let nolz_observer = new MutationObserver(function (mutations) {
                if (timeoutflag != null) {
                    clearTimeout(timeoutflag);
                }
                timeoutflag = setTimeout(() => {
                    that.do_paras_html()
                }, 1200);
            });

            nolz_observer.observe(document.documentElement, {
                childList: true,
                subtree  : true,
            });
            ////*2. url change*/
            window.addEventListener('popstate', function (e) {
                that.__clear_QUERY_FIELD_LIST()
            });


            var _wr           = function (type) {
                var orig = history[type];
                return function () {
                    var rv      = orig.apply(this, arguments);
                    var e       = new Event(type);
                    e.arguments = arguments;
                    window.dispatchEvent(e);
                    return rv;
                };
            };
            history.pushState = _wr('pushState');
            // history.replaceState = _wr('replaceState');

            window.addEventListener('pushState', function (e) {
                that.__clear_QUERY_FIELD_LIST();
            });


            ///*3. textarea*/
            bus.$on("comment_change_signal", (data) => {

                this.merge_comment(data)
            })

        },

        methods: {

            /* loadfinished */
            //监听触发操作
            __check_dom_exists(query_field) {
                if (this.QUERY_FIELD_LIST.hasOwnProperty(query_field)) {
                    return true;
                }
                else {
                    this.QUERY_FIELD_LIST[query_field] = query_field;
                    return false
                }
            },
            __clear_QUERY_FIELD_LIST() {
                delete this.QUERY_FIELD_LIST;
                this.QUERY_FIELD_LIST = {};
            },
            to_watching() {
                window.location.href = "https://github.com/watching";
            },
            do_paras_html() {
                let querys = window.location.search;

                let factory = TabManager.get_factory(querys);
                /*1. return one*/
                if (!factory) {
                    console.log("unkonw tab");
                    return
                }
                /**/
                let dom = {
                    get : (attr) => {
                        return $(dom_element).attr(attr)
                    },
                    text: function () {
                        return $(dom_element).text().trim()
                    },
                };

                //// 查询
                let query_field = "";
                let dom_element = null;
                let dom_list    = factory.get_dom_list();
                /*2. return two*/
                if (!dom_list) {
                    console.log("no dom_list.");
                    return
                }
                console.log(dom_list, dom_list.snapshotLength);

                //// 遍历
                for (let index = 0; index < dom_list.snapshotLength; index++) {
                    dom_element = dom_list.snapshotItem(index);
                    //dict = dom.attrib
                    if (factory.get_type() !== window.TabTypes.following) {
                        query_field = dom.get("href").replace(/[/]/g, "\\");
                    }
                    else {
                        query_field = "\\" + dom.text();
                    }

                    if (this.__check_dom_exists(query_field)) {

                    }
                    else {
                        // # 1.查数据库

                        let comment_obj = null;
                        const extra     = {
                            index      : index,
                            query_field: query_field,
                            factory    : factory,

                        };
                        try {
                            comment_obj = this.db_factory.db_get_data(extra)
                        }
                        catch (e) {
                            console.log("db error:", e)
                        }

                    }
                }
            },
            // 2.write to db.
            merge_comment(data) {
                let dom         = data.dom;
                let comment     = data.comment;
                let query_field = $(dom).attr("query_field").replace(/[/]/g, "\\");
                let to_db_data  = {
                    comment    : comment,
                    query_field: query_field,
                    position   : window.location.href,
                };
                this.db_factory.db_set_data(`${query_field}`, to_db_data)
            },

        },

        watch: {
            show_table_state: function (value) {
                localStorage.setItem("show_table_state", value)
            },
            remark_state    : function (value) {
                localStorage.setItem("remark_state", value);
                this.db_factory = value ? this.db_factory_backup : null;
            },
        },
    }
</script>
<!--CSS-->
<style>
   [v-cloak] {
      display: none
   }

   textarea {
      border: 2px solid #879db7;
   }

   .application--wrap {
      min-height: auto;
   }

   .v-input__slot {
      margin-bottom: 0px;
   }

   .v-messages {
      min-height: 0;
   }
   /*github clash ↓*/

   /*path-divider*/
   /*.d-flex>*, .d-inline-flex>* {*/
    /*flex:sasd;*/
   /*}*/

   code {

      box-shadow: unset;
   }
   /*github clash ↑*/
</style>
