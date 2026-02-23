// featureTree.js
const FeatureTree = {
    rawTree: `...`, // PASTE YOUR FULL TREE HERE

    parse(text) {
        const lines = text.split('\n');
        const root = { name: 'SOCIAL-MEDIA-ECOSYSTEM', children: [] };
        const stack = [{ node: root, depth: 0 }];

        for (let line of lines) {
            if (line.trim() === '' || line.trim() === '│') continue;
            const dashIndex = line.indexOf('──');
            if (dashIndex === -1) continue;
            const beforeDash = line.substring(0, dashIndex);
            const depth = (beforeDash.match(/│/g) || []).length;
            let name = line.substring(dashIndex + 2).replace(/\/$/, '').trim();
            const newNode = { name, children: [] };
            while (stack.length > 0 && stack[stack.length - 1].depth >= depth) stack.pop();
            if (stack.length === 0) continue;
            const parent = stack[stack.length - 1].node;
            parent.children.push(newNode);
            stack.push({ node: newNode, depth });
        }
        return root;
    },

    renderNode(node) {
        const li = document.createElement('li');
        li.className = node.children.length ? 'branch' : 'leaf';
        const div = document.createElement('div');
        div.className = 'tree-node';
        const caret = document.createElement('span');
        caret.className = 'caret';
        caret.textContent = '▶';
        if (node.children.length === 0) caret.style.visibility = 'hidden';
        const name = document.createElement('span');
        name.className = 'node-name';
        name.textContent = node.name;
        div.appendChild(caret);
        div.appendChild(name);
        li.appendChild(div);
        if (node.children.length > 0) {
            const childUl = document.createElement('ul');
            childUl.className = 'children';
            childUl.style.display = 'none';
            node.children.forEach(child => childUl.appendChild(this.renderNode(child)));
            li.appendChild(childUl);
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                const expanded = childUl.style.display !== 'none';
                childUl.style.display = expanded ? 'none' : 'block';
                caret.classList.toggle('expanded', !expanded);
            });
        }
        return li;
    },

    init() {
        const treeData = this.parse(this.rawTree);
        const container = document.getElementById('featureTree');
        if (!container) return;
        const rootUl = document.createElement('ul');
        rootUl.style.listStyle = 'none';
        rootUl.style.paddingLeft = '0';
        const rootLi = this.renderNode(treeData);
        const rootCaret = rootLi.querySelector('.caret');
        if (rootCaret) rootCaret.style.visibility = 'hidden';
        const rootChildren = rootLi.querySelector('ul');
        if (rootChildren) rootChildren.style.display = 'block';
        rootUl.appendChild(rootLi);
        container.appendChild(rootUl);
    }
};

window.FeatureTree = FeatureTree;
