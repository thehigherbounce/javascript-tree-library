(function () {
    const TreeView = function () {
        let treeData;
        let treeState = []; // temp data for tree state
        const getTreeData = function () { // get data with ajax
            treeState = getStateOfTree(); // load tree state from cookie
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    try {
                        treeData = JSON.parse(this.responseText);
                    } catch (error) {
                        console.error(error)
                    }
                }
            }
            xhttp.open("GET", "test.json", false);
            xhttp.send();
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
            return treeState.includes(id+'');
        }
        const makeTreeView = function () { // make treeview and bind events
            document.getElementById("myUL").innerHTML = loadTreeDataToHtml(treeData, []).join('');

            var toggler = document.getElementsByClassName("caret");
            var i;
            for (i = 0; i < toggler.length; i++) {
                toggler[i].addEventListener("click", itemClick);
            }
        }
        const loadTreeDataToHtml = function (data, html) { // make tree html
            if (html == undefined) html = [];
            if (data) {
                for (idx in data) {
                    let id = data[idx].id;
                    console.log(checkState(id))
                    let text = data[idx].text;
                    let children = data[idx].children;
                    html.push(`<li data-id="${id}">`);
                    if (children) html.push(`<span class="caret ${checkState(id) ? "caret-down" : ""}">${text}</span>`);
                    if (!children) html.push(text);
                    if (children) {
                        html.push(`<ul class="nested ${checkState(id) ? "active" : ""}">`);
                        loadTreeDataToHtml(children, html);
                        html.push(`</ul>`);
                    }
                    html.push(`</li>`);
                }
            }
            return html;
        }
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

        return {
            init: function () {
                getTreeData();
                makeTreeView();
            }
        }
    }();
    TreeView.init();
})();