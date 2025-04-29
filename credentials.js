class CredentialsManager {
    constructor() {
        this.credentials = [];
        this.modal = document.getElementById('credentialModal');
        this.form = document.getElementById('credentialForm');
        this.searchInput = document.getElementById('searchInput');
        this.filterSelect = document.getElementById('filterSelect');
        
        this.initializeEventListeners();
        this.loadCredentials();
    }

    initializeEventListeners() {
        // Add credential button
        document.getElementById('addCredentialBtn').addEventListener('click', () => this.showModal());

        // Close modal button
        document.querySelector('.close-modal').addEventListener('click', () => this.hideModal());

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCredential();
        });

        // Search and filter
        this.searchInput.addEventListener('input', () => this.filterCredentials());
        this.filterSelect.addEventListener('change', () => this.filterCredentials());

        // Edit and delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.action-btn.edit')) {
                const card = e.target.closest('.credential-card');
                this.editCredential(card.dataset.id);
            }
            if (e.target.closest('.action-btn.delete')) {
                const card = e.target.closest('.credential-card');
                this.deleteCredential(card.dataset.id);
            }
        });
    }

    async loadCredentials() {
        try {
            // Simulate API call
            const response = await this.fetchCredentials();
            this.credentials = response;
            this.renderCredentials();
        } catch (error) {
            console.error('Error loading credentials:', error);
            this.showError('Failed to load credentials');
        }
    }

    async fetchCredentials() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        provider: 'OpenAI',
                        name: 'GPT-4 API Key',
                        status: 'active',
                        lastUsed: '2024-03-15T10:30:00Z',
                        usage: '45%',
                        createdAt: '2024-02-01T00:00:00Z'
                    },
                    {
                        id: '2',
                        provider: 'Anthropic',
                        name: 'Claude API Key',
                        status: 'active',
                        lastUsed: '2024-03-14T15:45:00Z',
                        usage: '30%',
                        createdAt: '2024-02-15T00:00:00Z'
                    },
                    {
                        id: '3',
                        provider: 'Stability AI',
                        name: 'Stable Diffusion API',
                        status: 'inactive',
                        lastUsed: '2024-03-10T09:15:00Z',
                        usage: '15%',
                        createdAt: '2024-03-01T00:00:00Z'
                    }
                ]);
            }, 500);
        });
    }

    renderCredentials(credentials = this.credentials) {
        const grid = document.querySelector('.credentials-grid');
        grid.innerHTML = '';

        credentials.forEach(credential => {
            const card = document.createElement('div');
            card.className = 'credential-card';
            card.dataset.id = credential.id;

            card.innerHTML = `
                <div class="credential-header">
                    <div class="provider-info">
                        <img src="assets/${credential.provider.toLowerCase()}-logo.png" alt="${credential.provider}" class="provider-logo">
                        <div>
                            <h4>${credential.name}</h4>
                            <span class="credential-status ${credential.status}">${credential.status}</span>
                        </div>
                    </div>
                    <div class="credential-actions">
                        <button class="action-btn edit" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="credential-details">
                    <div class="detail-item">
                        <span class="label">Last Used</span>
                        <span class="value">${new Date(credential.lastUsed).toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Usage</span>
                        <span class="value">${credential.usage}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Created</span>
                        <span class="value">${new Date(credential.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });
    }

    filterCredentials() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filterValue = this.filterSelect.value;

        const filtered = this.credentials.filter(credential => {
            const matchesSearch = credential.name.toLowerCase().includes(searchTerm) ||
                                credential.provider.toLowerCase().includes(searchTerm);
            const matchesFilter = filterValue === 'all' || credential.provider === filterValue;
            return matchesSearch && matchesFilter;
        });

        this.renderCredentials(filtered);
    }

    showModal(credential = null) {
        if (credential) {
            // Populate form for editing
            document.getElementById('provider').value = credential.provider;
            document.getElementById('apiKey').value = '••••••••••••••••';
            document.getElementById('name').value = credential.name;
        } else {
            // Reset form for new credential
            this.form.reset();
        }

        this.modal.classList.add('show');
    }

    hideModal() {
        this.modal.classList.remove('show');
        this.form.reset();
    }

    async saveCredential() {
        const formData = new FormData(this.form);
        const credential = {
            provider: formData.get('provider'),
            apiKey: formData.get('apiKey'),
            name: formData.get('name')
        };

        try {
            // Simulate API call
            await this.saveCredentialToAPI(credential);
            this.hideModal();
            this.loadCredentials();
            this.showSuccess('Credential saved successfully');
        } catch (error) {
            console.error('Error saving credential:', error);
            this.showError('Failed to save credential');
        }
    }

    async saveCredentialToAPI(credential) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    async editCredential(id) {
        const credential = this.credentials.find(c => c.id === id);
        if (credential) {
            this.showModal(credential);
        }
    }

    async deleteCredential(id) {
        if (confirm('Are you sure you want to delete this credential?')) {
            try {
                // Simulate API call
                await this.deleteCredentialFromAPI(id);
                this.credentials = this.credentials.filter(c => c.id !== id);
                this.renderCredentials();
                this.showSuccess('Credential deleted successfully');
            } catch (error) {
                console.error('Error deleting credential:', error);
                this.showError('Failed to delete credential');
            }
        }
    }

    async deleteCredentialFromAPI(id) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }

    showSuccess(message) {
        // Implement success notification
        alert(message);
    }

    showError(message) {
        // Implement error notification
        alert(message);
    }
}

// Initialize the credentials manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CredentialsManager();
}); 