// Search functionality
const searchInput = document.querySelector('.search-bar input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const workflowCards = document.querySelectorAll('.workflow-card');
    
    workflowCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// New Workflow Button
document.querySelector('.new-workflow-btn').addEventListener('click', () => {
    // Redirect to workflow builder
    window.location.href = '/workflow-builder.html';
});

// Workflow Actions
document.querySelectorAll('.workflow-actions button').forEach(button => {
    button.addEventListener('click', (e) => {
        const action = e.target.closest('button').querySelector('i').className;
        const workflowCard = e.target.closest('.workflow-card');
        const workflowName = workflowCard.querySelector('h3').textContent;
        
        switch (action) {
            case 'fas fa-play':
                startWorkflow(workflowName);
                break;
            case 'fas fa-pause':
                pauseWorkflow(workflowName);
                break;
            case 'fas fa-edit':
                editWorkflow(workflowName);
                break;
            case 'fas fa-trash':
                deleteWorkflow(workflowName);
                break;
        }
    });
});

// Workflow Action Functions
function startWorkflow(name) {
    // Show loading state
    const status = document.querySelector(`.workflow-card h3:contains('${name}')`).closest('.workflow-header').querySelector('.status');
    status.textContent = 'Running';
    status.className = 'status running';
    
    // Simulate API call
    setTimeout(() => {
        // Update status
        status.textContent = 'Running';
        status.className = 'status running';
        
        // Add to activity feed
        addActivity('Started workflow "' + name + '"');
    }, 1000);
}

function pauseWorkflow(name) {
    // Show loading state
    const status = document.querySelector(`.workflow-card h3:contains('${name}')`).closest('.workflow-header').querySelector('.status');
    status.textContent = 'Paused';
    status.className = 'status paused';
    
    // Simulate API call
    setTimeout(() => {
        // Update status
        status.textContent = 'Paused';
        status.className = 'status paused';
        
        // Add to activity feed
        addActivity('Paused workflow "' + name + '"');
    }, 1000);
}

function editWorkflow(name) {
    // Redirect to workflow editor
    window.location.href = `/workflow-builder.html?name=${encodeURIComponent(name)}`;
}

function deleteWorkflow(name) {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
        // Show loading state
        const card = document.querySelector(`.workflow-card h3:contains('${name}')`).closest('.workflow-card');
        card.style.opacity = '0.5';
        
        // Simulate API call
        setTimeout(() => {
            // Remove card
            card.remove();
            
            // Add to activity feed
            addActivity('Deleted workflow "' + name + '"');
        }, 1000);
    }
}

// Activity Feed
function addActivity(message) {
    const activityList = document.querySelector('.activity-list');
    const now = new Date();
    const timeAgo = formatTimeAgo(now);
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <div class="activity-info">
            <p>${message}</p>
            <span>${timeAgo}</span>
        </div>
    `;
    
    // Add to top of list
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Remove oldest item if more than 10
    if (activityList.children.length > 10) {
        activityList.removeChild(activityList.lastChild);
    }
}

// Helper Functions
function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) {
        return 'just now';
    } else if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// View All Buttons
document.querySelectorAll('.view-all').forEach(button => {
    button.addEventListener('click', () => {
        const section = button.closest('section');
        const sectionName = section.className;
        
        // Redirect to appropriate page
        switch (sectionName) {
            case 'recent-workflows':
                window.location.href = '/workflows.html';
                break;
            case 'recent-activity':
                window.location.href = '/activity.html';
                break;
        }
    });
});

// User Profile Menu
document.querySelector('.user-profile').addEventListener('click', () => {
    // Toggle user menu dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <a href="/profile.html"><i class="fas fa-user"></i> Profile</a>
        <a href="/settings.html"><i class="fas fa-cog"></i> Settings</a>
        <a href="/logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
    `;
    
    document.querySelector('.user-menu').appendChild(dropdown);
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-profile') && !e.target.closest('.user-dropdown')) {
            dropdown.remove();
        }
    });
});

// Dashboard Class
class DashboardManager {
    constructor() {
        this.initializeEventListeners();
        this.loadDashboardData();
    }

    initializeEventListeners() {
        // Create workflow button
        document.querySelector('.create-workflow-btn').addEventListener('click', () => {
            window.location.href = '/workflow-builder.html';
        });

        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.textContent.trim();
                this.handleQuickAction(action);
            });
        });
    }

    async loadDashboardData() {
        try {
            const [stats, activities] = await Promise.all([
                this.fetchStats(),
                this.fetchRecentActivities()
            ]);
            
            this.updateStats(stats);
            this.updateActivities(activities);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data');
        }
    }

    async fetchStats() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    activeWorkflows: 12,
                    totalExecutions: 1234,
                    apiCredits: 1500,
                    communityMembers: 5678
                });
            }, 500);
        });
    }

    async fetchRecentActivities() {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        type: 'success',
                        title: 'Workflow "Content Generator" completed',
                        description: 'Generated 10 blog posts using GPT-4 and Stable Diffusion',
                        timestamp: '2 hours ago'
                    },
                    {
                        type: 'warning',
                        title: 'API Rate Limit Warning',
                        description: 'OpenAI API approaching rate limit (85% used)',
                        timestamp: '4 hours ago'
                    },
                    {
                        type: 'info',
                        title: 'New Template Available',
                        description: '"Customer Support Bot" template added to marketplace',
                        timestamp: '1 day ago'
                    }
                ]);
            }, 500);
        });
    }

    updateStats(stats) {
        // Update stat cards with fetched data
        document.querySelector('.stat-value:nth-child(2)').textContent = stats.activeWorkflows;
        document.querySelector('.stat-value:nth-child(3)').textContent = stats.totalExecutions;
        document.querySelector('.stat-value:nth-child(4)').textContent = `$${stats.apiCredits}`;
        document.querySelector('.stat-value:nth-child(5)').textContent = stats.communityMembers;
    }

    updateActivities(activities) {
        const activityList = document.querySelector('.activity-list');
        activityList.innerHTML = '';

        activities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';

            activityItem.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-details">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.timestamp}</span>
                </div>
            `;

            activityList.appendChild(activityItem);
        });
    }

    getActivityIcon(type) {
        switch (type) {
            case 'success':
                return 'check';
            case 'warning':
                return 'exclamation-triangle';
            case 'info':
                return 'info';
            default:
                return 'info';
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'Create New Workflow':
                window.location.href = '/workflow-builder.html';
                break;
            case 'Import Template':
                window.location.href = '/templates.html';
                break;
            case 'Add API Key':
                window.location.href = '/credentials.html';
                break;
            case 'Share Workflow':
                this.showShareModal();
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    showShareModal() {
        // Implement share modal functionality
        alert('Share functionality coming soon!');
    }

    showError(message) {
        // Implement error notification
        alert(message);
    }
}

// Initialize the dashboard manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DashboardManager();
}); 