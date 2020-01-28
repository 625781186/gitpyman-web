"use strict";
import siLog from 'si-log'
import bus from "./github_vue_bus.js"

var TabTypes = {
    repositories: "repositories",
    stars       : "stars",
    following   : "following",
    other       : "other",
    // repositories:30,
};

window.TabTypes = TabTypes;

var html = {
    xpath: (...args) => {
        return document.evaluate(...args)
    },
};


/*抽象Tab工厂*/
class AbsTabFactory {
    constructor() {
        // this.connect()
        siLog.debug("tab is :", this.get_type())
    }

    get_type() {
        return "other"
    }

    get_dom_list() {

    }

    addDom_TextArea() {

    }

    on_TextArea_Change(dom_textxarea) {
        dom_textxarea.on("change", e => {
            let dom         = e.target;
            let new_comment = dom.value;
            bus.$emit("comment_change_signal", {
                dom    : dom,
                comment: new_comment,
            })

        })
    }

}

/*具体 */
class RepositoriesTabFactory extends AbsTabFactory {


    get_type() {
        return TabTypes.repositories
    }

    get_dom_list() {
        return html.xpath('//*[@id="user-repositories-list"]/ul/li//h3/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    }

    addDom_TextArea(index, comment, query_field) {
        let mian_Index = Math.floor((index) / 30);
        let new_index  = index - mian_Index * 30;
        let container  = document.querySelectorAll("#user-repositories-list")[mian_Index];
        let li         = $(container).find("ul").children()[new_index];
        let before_dom = $(li).find(">:eq(0)");
        before_dom.after(`<div><textarea query_field=${query_field}></textarea></div>`);
        let dom_textxarea = $(before_dom).next();
        $(dom_textxarea).find("textarea").val(comment);
        // $(dom_textxarea).attr("query_field",query_field)  ;
        // $(dom_textxarea)[0].val("hhh");
        // $(dom_textxarea).change();
        // $(dom_textxarea)[0].pyindex = index;
        this.on_TextArea_Change(dom_textxarea)

    }
}

/*具体 */
class StarsTabFactory extends AbsTabFactory {


    get_type() {
        return TabTypes.stars
    }

    get_dom_list() {
        return html.xpath('//*[@id="js-pjax-container"]/div//h3/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    }

    addDom_TextArea(index, comment, query_field) {
        let mian_Index = Math.floor((index) / 30);
        let container  = document.querySelectorAll("#js-pjax-container")[mian_Index];
        let new_index  = 2 + (index - mian_Index * 30);
        let li         = $(container).find("div > div.col-lg-9.col-md-8.col-12.float-md-left.pl-md-2 > div.position-relative").children()[0];
        let before_dom = $(li).find(`>div>div:nth-child(${new_index})>div.py-1`);
        before_dom.after(`<div ><textarea style='width: 100%' query_field=${query_field}></textarea></div>`);
        let dom_textxarea = before_dom.next();
        $(dom_textxarea).find("textarea").val(comment);
        // $(dom_textxarea).query_field = query_field;
        // $(dom_textxarea).change();
        // $(dom_textxarea)[0].pyindex = index;
        this.on_TextArea_Change(dom_textxarea)
    }
}

/*具体 */
class FollowingTabFactory extends AbsTabFactory {
    connect() {

    }

    get_type() {
        return TabTypes.following
    }

    get_dom_list() {
        return html.xpath('// *[ @ id = "js-pjax-container"]/div//a/span[2]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    }

    addDom_TextArea(index, comment, query_field) {
        let mian_Index = Math.floor((index) / 30);

        let container  = document.querySelectorAll("#js-pjax-container")[mian_Index];
        let new_index  = index - mian_Index * 30;
        let li         = $(container).find("div > div.col-lg-9.col-md-8.col-12.float-md-left.pl-md-2 > div.position-relative").children()[new_index];
        let before_dom = $(li).find(">:eq(1)");
        before_dom.after(`<div style='float: right;'><textarea  query_field=${query_field}></textarea></div>`);
        let dom_textxarea = before_dom.next();
        $(dom_textxarea).find("textarea").val(comment);
        // $(dom_textxarea).query_field = query_field;
        // $(dom_textxarea).change();
        // $(dom_textxarea)[0].pyindex = index;
        this.on_TextArea_Change(dom_textxarea)
    }

}

/*具体  Organizations 组织 ?*/
class OtherTabFactory extends AbsTabFactory {


    get_type() {
        return TabTypes.other
    }

    get_dom_list() {
        return html.xpath('//*[@id="org-repositories"]/div[1]/div/ul//h3/a', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    }

    addDom_TextArea(index, comment, query_field) {
        let mian_Index = Math.floor((index) / 30);

        let container = document.querySelectorAll("#org-repositories")[mian_Index];
        let new_index = index - mian_Index * 30;

        let li = $(container).find("div.col-8.d-inline-block > div > ul ").children()[new_index];
        if (li) {

            let before_dom = $(li).find(">:eq(0)");
            before_dom.after(`<div><textarea query_field=${query_field}></textarea></div>`);
            let dom_textxarea = before_dom.next();
            $(dom_textxarea).find("textarea").val(comment);
            // $(dom_textxarea).query_field = query_field;
            // $(dom_textxarea).change();
            // $(dom_textxarea)[0].pyindex = index;
            this.on_TextArea_Change(dom_textxarea);
            return
        }
        li = $(container).find("div.col-12.col-md-8.d-md-inline-block > div > ul ").children()[new_index];
        siLog.debug("find li :",index, new_index);
        if (li) {

            let before_dom = $(li).find(">:eq(0)");
            before_dom.after(`<div ><textarea style='width: 100%' query_field=${query_field}></textarea></div>`);
            let dom_textxarea = before_dom.next();
            $(dom_textxarea).find("textarea").val(comment);
            // $(dom_textxarea).change();
            // $(dom_textxarea)[0].pyindex = index;
            this.on_TextArea_Change(dom_textxarea);

        }

    }

}

//
class TabManager {
    static __judge_in(q, querys) {
        return querys.indexOf(q) !== -1
    }

    static get_factory(querys) {
        let factory = null;
        if (TabManager.__judge_in("tab=repositories", querys)) {
            factory = new RepositoriesTabFactory();
        }
        else if (TabManager.__judge_in("tab=stars", querys)) {
            factory = new StarsTabFactory();
        }
        else if (TabManager.__judge_in("tab=following", querys)) {
            factory = new FollowingTabFactory();
        }
        // else if (1) {
        //     TYPE = 30;
        //     /*        len([org for org in github.get_organizations() if org in url))
        //         ])*/
        // }
        else {
            factory = new OtherTabFactory();
        }

        return factory

    }

}

export {

    TabManager,
}
