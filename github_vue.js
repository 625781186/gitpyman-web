"use strict";

import Vue from 'vue/dist/vue.esm.js'

//////////////////////////////////////////////

import 'view-design/dist/styles/iview.css';
import ViewUI from 'view-design';

Vue.use(ViewUI);


//////////////////////////////////////////////
//////////////////////////////////////////////
// import 'vuetify/dist/vuetify.min.css'


import Vuetify from 'vuetify'
Vue.use(Vuetify, {
  iconfont: 'mdi',
})



//////////////////////////////////////////////


require("./lib/jquery-1.9.0.min.js")
import {TabManager} from "./github_vue_tab.js"
import {DBManager} from "./github_vue_db.js"
import VVTable from './components/table'

function add_dom() {

    /*vuetify icon*/
    var link1 = document.createElement("link");
    link1.rel = "stylesheet";
    link1.type = "text/css";
    link1.href = "https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css";
    var link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.type = "text/css";
    link2.href = "https://fonts.googleapis.com/css?family=Material+Icons";

    let head = document.getElementsByTagName("head")[0];
    head.appendChild(link1);
    head.appendChild(link2);
    /*vuetify el*/
    var div = document.createElement("div");
    div.id = "aha"

    let first_dom = document.body.firstChild;//得到页面的第一个元素
    let wraphtml  = document.body.insertBefore(div, first_dom);


    window.vm = new Vue({

        el        : '#aha',
        components: {VVTable},
        data() {
            return {

                QUERY_FIELD_LIST: {},
                db_factory      : null,
                show_table_state: true,
                switch1         : true,
                switch2         : false,

                columns12: [
                    {
                        title: 'Query_field',
                        slot : 'query_field',
                    },
                    {
                        title: 'Comment',
                        key  : 'comment',
                    },

                    {
                        title: 'Action',
                        slot : 'action',
                        width: 150,
                        align: 'center',
                    },
                ],
                data6    : [
                    {
                        query_field: '\\brucegua\\moocos',
                        comment    : "测试",

                    },

                ],
            }
        },
        created() {

            this.db_factory = DBManager.get_factory('firebase');
            // console.log(this.db_factory)
            // this.db_factory.db_get_data()

        },
        mounted() {

            var timeoutflag   = null;
            ///*dom change event*/
            let nolz_observer = new MutationObserver(function (mutations) {

                if (timeoutflag != null) {
                    clearTimeout(timeoutflag);
                }

                timeoutflag = setTimeout(function () {
                    window.vm.do_paras_html() //// here start
                }, 1200);
            });

            nolz_observer.observe(document.documentElement, {
                childList: true,
                subtree  : true,
            });
            ///*textarea*/
            this.$on("comment_change", (data) => {

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
                    this.QUERY_FIELD_LIST[query_field] = query_field
                    return false
                }
            },

            do_paras_html() {
                let querys = window.location.search;

                let factory = TabManager.get_factory(querys);
                /*1. return one*/
                if (!factory) {
                    console.log("unkonw tab")
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
                let dom_list    = factory.get_dom_list()
                /*2. return two*/
                if (!dom_list) {
                    console.log("no dom_list.")
                    return
                }
                console.log(dom_list, dom_list.snapshotLength);


                for (let index = 0; index < dom_list.snapshotLength; index++) {
                    dom_element = dom_list.snapshotItem(index)
                    //dict = dom.attrib
                    if (factory.get_type() !== window.TabTypes.following) {
                        query_field = dom.get("href").replace(/[/]/g, "\\");
                    }
                    else {
                        query_field = dom.text().replace(/[/]/g, "\\");
                    }

                    if (this.__check_dom_exists(query_field)) {
                        continue;
                    }
                    else {
                        // # 1.查数据库
                        let doc         = query_field;
                        var comment_obj = null;
                        const extra     = {
                            index      : index,
                            query_field: query_field,
                            factory    : factory,

                        }
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
                let query_field = $(dom).attr("query_field").replace(/[/]/g, "\\")
                let to_db_data  = {comment: comment, query_field: query_field}
                this.db_factory.db_set_data(`${query_field}`, to_db_data)
            },
            // show_table() {
            //     this.show_table_state = !this.show_table_state
            // },
            to_url(index) {
                this.$Modal.info({
                    title  : 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`,
                })
            },
            delete_doc(index) {
                this.data6.splice(index, 1);
                this.db_factory.delete_doc(index, 1);
            },
        },

        template: `<div style='z-index:5;
                                color:red;
                                position : fixed;
                                top : 64px;
                                left: "0";
                       
                                backgroundColor : "#232322"; '>
                             
                    
                    <i-switch 
                        size="large" 
                        :value="show_table_state"
                        v-model="show_table_state"
                    >
                        <span slot="open" >Show</span>
                        <span slot="close">Hide</span>
                    </i-switch>

                    <Tabs v-if="show_table_state" 
                        value="name1"
                        style="max-width:800px;background-color: #ffffff!important">
                        <TabPane label="标签一" name="name1">
          
                            <VVTable></VVTable>
                                
                       
                        </TabPane>
                    <TabPane label="标签二" name="name3">标签三的内容</TabPane>
                    </Tabs>

                   </div>`,

    })
}

window.add_dom = add_dom

