// 渲染目录书
function treeRender(data, rootNode) {
    var treeNode = document.createElement("ul")

    for (let i = 0; i < data.length; i++) {
        let innerHtml = ''
        const hasChild = data[i].children && data[i].children.length > 0
        const icon = '<svg viewBox="0 0 1024 1024" focusable="false" class="icon" data-icon="caret-down" width="12px" height="12px" fill="currentColor" aria-hidden="true"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>'

        innerHtml += `<li class="${hasChild ? 'folder' : 'file'}"><div class="name">${hasChild ? icon : ''}${data[i].name}</div></li>`

        const div = document.createElement("div");
        div.innerHTML = innerHtml
        const liNode = div.childNodes[0]
        treeNode.appendChild(liNode)

        if (hasChild) {
            // 优先渲染上级目录
            setTimeout(() => {
                treeRender(data[i].children, liNode)
            }, 200)
        }
    }

    rootNode.appendChild(treeNode)
}

const aDom = new aboutDom()
const treeDom = document.getElementById('tree')

treeRender(treeData, treeDom)

// 代理点击事件
treeDom.addEventListener('click', function (e) {
    let targetDom = aDom.find(e.target).getParentByClass('name')
    targetDom ? targetDom = targetDom.parentNode : null

    if (aDom.find(targetDom).hasClass('folder')) {
        const ul = targetDom.getElementsByTagName('ul')[0]
        if (!aDom.find(ul).hasClass('show')) {
            aDom.find(ul).removeClass('hide').addClass('show')
        } else {
            aDom.find(ul).removeClass('show').addClass('hide')
        }
    }
})



// dom 相关方法
function aboutDom() {

    this.find = function(node) {
        this.elem = node
        return this
    }

    this.hasClass = function (cls, elem) {
        elem = elem || this.elem
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false;
        return elem && elem.className && new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }

    this.addClass = function (cls) {
        const elem = this.elem
        if (!this.hasClass(cls)) {
            this.elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
        }
        return this
    }

    this.removeClass = function (cls) {
        const elem = this.elem
        if (this.hasClass(cls)) {
            var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            elem.className = newClass.replace(/^\s+|\s+$/g, '');
        }
        return this
    }

    this.getParentByClass = function (className) {
        let elem = this.elem

        if (!elem) { return null }

        if (this.hasClass(className)) {
            return elem
        }

        while (elem) {
            if (this.hasClass(className, elem.parentNode)) {
                elem = elem.parentNode
                break
            }

            elem = elem.parentNode
        }

        return elem
    }
}