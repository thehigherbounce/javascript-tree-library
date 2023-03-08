(function () {
    const TreeView = function () {
        let treeState;

        const saveStateOfTree = function () { // save tree list into cookie
            const d = new Date();
            d.setTime(d.getTime() + 15 * 60 * 1000);
            let expires = "expires=" + d.toUTCString();
            document.cookie = "openIds=" + treeState.join(',') + ';' + expires + ';path=/';
        }
        const getStateOfTree = function () {
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            let name = "openIds=";
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf("openIds=") == 0) {
                    return c.substring(name.length, c.length).split(',');
                }
            }
            return [];
        }
        
        const itemClick = function () { // when the user click treelist, capture list id and save it into cookie data
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
            if (this.classList.contains("caret-down")) {
                treeState.push(this.parentElement.getAttribute('data-id'))
            } else {
                treeState = treeState.filter((item) => item != this.parentElement.getAttribute('data-id'));
            }
            saveStateOfTree();
        }
        const checkState = function (id) { // check item clicked when load tree list
            return treeState.includes(id);
        }
        const makeOpend = function(dom) {
            if(checkState(dom.parentElement.getAttribute("data-id"))) {
                dom.parentElement.querySelector(".nested").classList.add("active");
                dom.classList.add("caret-down");
            }
        }
        const makeTreeView = function () { // make treeview and bind events

            var toggler = document.getElementsByClassName("caret");
            var i;
            for (i = 0; i < toggler.length; i++) {
                makeOpend(toggler[i]);
                toggler[i].addEventListener("click", itemClick);
            }
        }


        return {
            init: function () {
                treeState = getStateOfTree(); // temp data for tree state
                makeTreeView();
            }
        }
    }();
    TreeView.init();
})();