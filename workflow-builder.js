// Workflow Builder Class
class WorkflowBuilder {
    constructor() {
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.draggedNode = null;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.offsetX = 0;
        this.offsetY = 0;

        this.initialize();
    }

    initialize() {
        // Initialize DOM elements
        this.canvas = document.querySelector('.canvas-area');
        this.nodesContainer = document.querySelector('.nodes-container');
        this.propertiesPanel = document.querySelector('.properties-panel');
        this.saveBtn = document.querySelector('.save-btn');
        this.runBtn = document.querySelector('.run-btn');

        // Initialize event listeners
        this.initializeEventListeners();
        this.initializeNodePalette();
    }

    initializeEventListeners() {
        // Save button click
        this.saveBtn.addEventListener('click', () => this.saveWorkflow());

        // Run button click
        this.runBtn.addEventListener('click', () => this.runWorkflow());

        // Canvas click
        this.canvas.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                this.deselectNode();
            }
        });

        // Canvas drag
        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        this.canvas.addEventListener('mousemove', (e) => this.drag(e));
        this.canvas.addEventListener('mouseup', () => this.endDrag());
        this.canvas.addEventListener('mouseleave', () => this.endDrag());
    }

    initializeNodePalette() {
        const nodeItems = document.querySelectorAll('.node-item');
        nodeItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.type);
            });
        });

        this.canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const nodeType = e.dataTransfer.getData('text/plain');
            this.createNode(nodeType, e.clientX, e.clientY);
        });
    }

    createNode(type, x, y) {
        const node = {
            id: Date.now().toString(),
            type,
            x: x - this.canvas.offsetLeft,
            y: y - this.canvas.offsetTop,
            properties: this.getDefaultProperties(type)
        };

        this.nodes.push(node);
        this.renderNode(node);
    }

    getDefaultProperties(type) {
        const properties = {
            name: `${type} Node`,
            description: '',
            parameters: {}
        };

        switch (type) {
            case 'language-model':
                properties.parameters = {
                    model: 'gpt-4',
                    temperature: 0.7,
                    maxTokens: 1000
                };
                break;
            case 'image-generation':
                properties.parameters = {
                    model: 'dall-e-3',
                    size: '1024x1024',
                    quality: 'standard'
                };
                break;
            case 'utility':
                properties.parameters = {
                    operation: 'transform',
                    format: 'json'
                };
                break;
        }

        return properties;
    }

    renderNode(node) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.dataset.id = node.id;
        nodeElement.style.left = `${node.x}px`;
        nodeElement.style.top = `${node.y}px`;

        nodeElement.innerHTML = `
            <div class="node-header">
                <i class="fas fa-${this.getNodeIcon(node.type)}"></i>
                <span>${node.properties.name}</span>
            </div>
            <div class="node-body">
                <div class="node-input"></div>
                <div class="node-output"></div>
            </div>
        `;

        nodeElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectNode(node);
        });

        this.nodesContainer.appendChild(nodeElement);
    }

    getNodeIcon(type) {
        switch (type) {
            case 'language-model': return 'comment-dots';
            case 'image-generation': return 'image';
            case 'utility': return 'cogs';
            default: return 'circle';
        }
    }

    selectNode(node) {
        this.deselectNode();
        this.selectedNode = node;
        document.querySelector(`.node[data-id="${node.id}"]`).classList.add('selected');
        this.updatePropertiesPanel(node);
    }

    deselectNode() {
        if (this.selectedNode) {
            document.querySelector(`.node[data-id="${this.selectedNode.id}"]`).classList.remove('selected');
            this.selectedNode = null;
            this.updatePropertiesPanel();
        }
    }

    updatePropertiesPanel(node = null) {
        if (!node) {
            this.propertiesPanel.innerHTML = '<div class="no-selection">Select a node to edit its properties</div>';
            return;
        }

        this.propertiesPanel.innerHTML = `
            <h3>Node Properties</h3>
            <div class="property-group">
                <h4>Basic Settings</h4>
                <div class="property-item">
                    <label>Name</label>
                    <input type="text" value="${node.properties.name}" 
                           onchange="workflowBuilder.updateNodeProperty('${node.id}', 'name', this.value)">
                </div>
                <div class="property-item">
                    <label>Description</label>
                    <textarea onchange="workflowBuilder.updateNodeProperty('${node.id}', 'description', this.value)">
                        ${node.properties.description}
                    </textarea>
                </div>
            </div>
            <div class="property-group">
                <h4>Parameters</h4>
                ${this.renderParameters(node)}
            </div>
        `;
    }

    renderParameters(node) {
        let html = '';
        for (const [key, value] of Object.entries(node.properties.parameters)) {
            html += `
                <div class="property-item">
                    <label>${this.formatParameterName(key)}</label>
                    <input type="${this.getInputType(key)}" 
                           value="${value}"
                           onchange="workflowBuilder.updateNodeParameter('${node.id}', '${key}', this.value)">
                </div>
            `;
        }
        return html;
    }

    formatParameterName(name) {
        return name.split(/(?=[A-Z])/).join(' ').toLowerCase();
    }

    getInputType(key) {
        if (key === 'temperature') return 'number';
        if (key === 'maxTokens') return 'number';
        return 'text';
    }

    updateNodeProperty(nodeId, property, value) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.properties[property] = value;
            this.updateNodeDisplay(node);
        }
    }

    updateNodeParameter(nodeId, parameter, value) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            node.properties.parameters[parameter] = value;
        }
    }

    updateNodeDisplay(node) {
        const nodeElement = document.querySelector(`.node[data-id="${node.id}"]`);
        if (nodeElement) {
            nodeElement.querySelector('.node-header span').textContent = node.properties.name;
        }
    }

    startDrag(e) {
        const nodeElement = e.target.closest('.node');
        if (nodeElement) {
            this.isDragging = true;
            this.draggedNode = this.nodes.find(n => n.id === nodeElement.dataset.id);
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.offsetX = this.draggedNode.x - e.clientX;
            this.offsetY = this.draggedNode.y - e.clientY;
            nodeElement.style.cursor = 'grabbing';
        }
    }

    drag(e) {
        if (!this.isDragging || !this.draggedNode) return;

        const nodeElement = document.querySelector(`.node[data-id="${this.draggedNode.id}"]`);
        if (nodeElement) {
            const x = e.clientX + this.offsetX;
            const y = e.clientY + this.offsetY;
            
            this.draggedNode.x = x;
            this.draggedNode.y = y;
            
            nodeElement.style.left = `${x}px`;
            nodeElement.style.top = `${y}px`;
        }
    }

    endDrag() {
        if (this.isDragging && this.draggedNode) {
            const nodeElement = document.querySelector(`.node[data-id="${this.draggedNode.id}"]`);
            if (nodeElement) {
                nodeElement.style.cursor = 'grab';
            }
        }
        this.isDragging = false;
        this.draggedNode = null;
    }

    saveWorkflow() {
        const workflow = {
            nodes: this.nodes,
            connections: this.connections,
            metadata: {
                name: document.querySelector('.workflow-title').value,
                description: document.querySelector('.workflow-description').value,
                createdAt: new Date().toISOString()
            }
        };

        // Save to localStorage for now
        localStorage.setItem('currentWorkflow', JSON.stringify(workflow));
        alert('Workflow saved successfully!');
    }

    runWorkflow() {
        // Validate workflow
        if (this.nodes.length === 0) {
            alert('Please add at least one node to the workflow');
            return;
        }

        // Prepare workflow data
        const workflow = {
            nodes: this.nodes,
            connections: this.connections
        };

        // Send to backend
        fetch('/api/workflows/run', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workflow)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Workflow execution started!');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to run workflow');
        });
    }
}

// Initialize workflow builder when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.workflowBuilder = new WorkflowBuilder();
}); 